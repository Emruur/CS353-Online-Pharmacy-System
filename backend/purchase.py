import mysql
from flask import Blueprint, g, request, jsonify
from config import db_config
from datetime import datetime
import json
from collections import defaultdict

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

purchase_blueprint = Blueprint(' purchase', __name__)
db_config = db_config
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)


def get_conn():
    if 'conn' not in g:
        g.conn = pool.get_connection()
    return g.conn


@purchase_blueprint.teardown_app_request
def close_conn(e):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()


# methods to get/update wallet balance
@purchase_blueprint.route('/wallet', methods=['GET', 'PUT'])
@jwt_required()
def updateWallet():
    current_user = get_jwt_identity()
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Patient WHERE user_id = %s", (current_user,))
    patient = cursor.fetchone()
    if request.method == "PUT":
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        try:
            amount = request.json.get('amount', None)
            
            cursor.execute(
                "UPDATE Wallet SET balance = balance + %s WHERE wallet_id = %s",
                (amount, patient[5])
            )
            conn.commit()
            updatedRows = cursor.rowcount

            if updatedRows < 1:
                return jsonify({"msg": "Wallet balance is not changed"}), 200
            return jsonify({"msg": "Wallet balance is updated successfully"}), 200
        except Exception as e:
            conn.rollback()
            return f'Transaction failed: {str(e)}', 500
        
    if request.method == "GET":
        try:            
            cursor.execute(
                "SELECT balance FROM Wallet WHERE wallet_id = %s",
                (patient[5],)
            )
            balance = cursor.fetchone()

            return jsonify({"balance": balance}), 200
        except Exception as e:
            conn.rollback()
            return f'Transaction failed: {str(e)}', 500

@purchase_blueprint.route('/', methods=['POST', 'GET'])
@jwt_required()
def purchase():
    """
    prescription() can be used to create a new prescription object, or fetch all the prescriptions written for the logged
    in user. Requires authentication.

    http://localhost:5000/purchase
    post request is atomic
    post request data format:
    {
        "medicine" : [
                        {
                        "id": 1,
                         "quantity" : 5
                        },
                        {
                        "id": 3,
                         "quantity" : 2
                        }
                        ]
    }
    date is current time, status is valid by default.
    """
    current_user = get_jwt_identity()
    conn = get_conn()
    cursor = conn.cursor()
    if request.method == 'POST':
        try:
            if not request.is_json:
                return jsonify({"msg": "Missing JSON in request"}), 400
            try:
                conn.autocommit = False
                ## check if pharmacy exists
                p_id = request.json.get("pharmacy_id")
                query = "SELECT * FROM Pharmacy WHERE pharmacy_id = %s"
                cursor.execute(query, (p_id,))
                result = cursor.fetchone()
                if not result:
                    return jsonify({"msg": "No pharmacy"}), 400
                
                ##check if medicine can be purchased(prescription check)
                med_list= request.json.get("medicine")
                medid_list= [med["id"] for med in med_list]
                quantities= [med["quantity"] for med in med_list]

                
                invalidated= []
                for med in medid_list:
                    print("med:",med)

                    query = """SELECT pres_id
                        FROM Prescription NATURAL JOIN PrescribedMedication
                        WHERE Prescription.status='valid' and PrescribedMedication.med_id= '%s'
                    """
                    print("i")
                    cursor.execute(query,(med,))
                    print("f")
                    result = cursor.fetchone()
                    print("s")
                    print("r:",result)
                    if not result:
                        return jsonify({"msg": "Cant buy medicine not allowed"}), 400
                    
                    invalidated.append(result[0])
                
                print("--0")
                #Invalidate Prescription
                invalidated_str = ','.join(map(str, invalidated))
                update_query = "UPDATE Prescription SET status='used' WHERE pres_id IN ({})".format(invalidated_str)
                cursor.execute(update_query)
                    
                

                    
                # Fetch the prices
                query = "SELECT med_id, price FROM Medicine WHERE med_id in ({})".format(','.join(map(str, medid_list)))
                cursor.execute(query)

                # Calculate the total price
                total_price = 0
                for med_id, price in cursor:
                    index = medid_list.index(med_id)
                    total_price += price * quantities[index]
                print(total_price)
                print("--1")
                
                sql = f"""
                    UPDATE Wallet
                    SET balance = balance - {total_price}
                    WHERE wallet_id = (SELECT wallet_id FROM Patient WHERE user_id = {current_user})
                """
                cursor.execute(sql)
                print("--2")

                #deduct medicines from the storage of pharmacies
                for med in med_list:
                    cursor.execute("""
                    UPDATE StoredIn
                    SET amount = amount - %s
                    WHERE pharmacy_id = %s AND med_id = %s;
                    """, (med["quantity"], p_id, med["id"]))

                print("--3")

                ## create a purchase object
                cursor.execute("SELECT wallet_id FROM Patient WHERE user_id = %s",(current_user,))
                w_id= cursor.fetchone()[0]
                print(w_id)
                cursor.execute("""
                    INSERT INTO Purchase (pharmacy_id, date, deduction, wallet_id, user_id)
                    VALUES (%s, %s, %s, %s, %s);
                    """,(p_id, datetime.now().date().strftime('%Y-%m-%d'), total_price, w_id, current_user))
                

                print("--4")

                purchase_id = cursor.lastrowid
                print("PR",purchase_id)
                ## create purchased medicine objects
                for med in med_list:
                    cursor.execute("""
                        INSERT INTO PurchasedMedicine (purchase_id, purchase_count, med_id)
                        VALUES (%s, %s, %s);
                    """,(purchase_id,med["quantity"],med["id"],))
                print("--5")

                

                conn.commit()
                return jsonify({"msg": "Purchase created successfully"}), 200
            except Exception as e:
                conn.rollback()
                return f'Transaction failed: {str(e)}', 500
            finally:
                conn.autocommit = True

        except Exception as e:
            return jsonify({"msg": str(e)}), 405

    elif request.method == 'GET':
        '''{
        "purchase_id": 1,
        "pharmacy_id": 1,
        "date": "2023-06-03",
        "deduction": 100.00,
        "wallet_id": 2,
        "user_id": "U001",
        "med_id": [101, 102],
        "purchase_count": [2, 3]
    },
        '''
        
        try:
            # Execute the query
            cursor.execute("""
                SELECT Medicine.name as name, PrescribedMedication.med_count as quantity, (PrescribedMedication.med_count * Medicine.price) as total, date as date, 0 as balance, 
                FROM Purchase
                INNER JOIN PurchasedMedicine ON Purchase.purchase_id = PurchasedMedicine.purchase_id
                INNER JOIN Medicine ON PurchasedMedicine.med_id = Medicine.med_id;
                 """)


            # Fetch all rows from the last executed statement
            rows = cursor.fetchall()

            # Convert to JSON
            json_data = json.dumps(rows, default=str)  # Convert dates to string

            return json_data
        except Exception as e:
            print(e)
            return jsonify({"msg": "Couldn't get purchases"}), 500


