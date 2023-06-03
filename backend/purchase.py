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

                medid_list= [str(med["id"]) for med in med_list]
                for med in med_list:
                    print(med)

                    query = "SELECT * FROM patient_prescription WHERE med_id = %s"
                    cursor.execute(query, (med.get("id"),))
                    result = cursor.fetchone()
                    if not result:
                        return jsonify({"msg": "Cant buy medicine not allowed"}), 400
                
                ##balance deduction
                query = "SELECT SUM(price) as total_price FROM Medicine WHERE med_id in (select med_id from patient_prescription where" \
                        " user_id = %s)"
                cursor.execute(query, (current_user,))
                total_price = cursor.fetchone()
                total_price = float(total_price[0])
                print(total_price)
                sql = f"""
                    UPDATE Wallet
                    SET balance = balance - {total_price}
                    WHERE wallet_id = (SELECT wallet_id FROM Patient WHERE user_id = {current_user})
                """
                cursor.execute(sql)

                #deduct medicines from the storage of pharmacies
                for med in med_list:
                    cursor.execute("""
                    UPDATE StoredIn
                    SET amount = amount - %s
                    WHERE pharmacy_id = %s AND med_id = %s;
                    """, (med["quantity"], p_id, med["id"]))

                ## create a purchase object
                cursor.execute("SELECT wallet_id FROM Patient WHERE user_id = %s",(current_user,))
                w_id= cursor.fetchone()
                print(w_id)
                cursor.execute("""
                    INSERT INTO Purchase (pharmacy_id, date, deduction, wallet_id, user_id)
                    VALUES (%s, %s, %s, %s, %s);
                    """,(p_id, datetime.now().date().strftime('%Y-%m-%d'), total_price, w_id[0], current_user))

                purchase_id = cursor.lastrowid
                ## create purchased medicine objects
                for med in med_list:
                    cursor.execute("""
                        INSERT INTO PurchasedMedicine (purchase_id, purchase_count, med_id)
                        VALUES (?, ?, ?);
                    """,(purchase_id,med["quentity"],med["id"]))

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
                SELECT Purchase.*, PurchasedMedicine.med_id, PurchasedMedicine.purchase_count 
                FROM Purchase
                INNER JOIN PurchasedMedicine ON Purchase.purchase_id = PurchasedMedicine.purchase_id;
            """)

            # Fetch all rows from the last executed statement
            rows = cursor.fetchall()

            # Group rows by purchase_id
            grouped = defaultdict(lambda: defaultdict(list))
            for row in rows:
                purchase_id = row.pop('purchase_id')
                grouped[purchase_id]['purchase_id'] = purchase_id
                for key, value in row.items():
                    if key in ['med_id', 'purchase_count']:
                        grouped[purchase_id][key].append(value)
                    else:
                        grouped[purchase_id][key] = value

            # Convert to JSON
            json_data = json.dumps(list(grouped.values()), default=str)  # Convert dates to string

            return json_data
        except Exception as e:
            print(e)
            return jsonify({"msg": "Couldn't get purchases"}), 500


