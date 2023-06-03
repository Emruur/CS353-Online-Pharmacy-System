import mysql
from flask import Blueprint, g, request, jsonify
from config import db_config
from datetime import datetime

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


@purchase_blueprint.route('/request', methods=['POST', 'GET'])
@jwt_required()
def purchase():
    """
    prescription() can be used to create a new prescription object, or fetch all the prescriptions written for the logged
    in user. Requires authentication.

    http://localhost:5000/prescription
    post request is atomic
    post request data format:
    {
        "medicine" : [
                        {
                        "id": 1,
                         "quantity" : 5,
                        },
                        {
                        "id": 3,
                         "quantity" : 2,
                        },
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
                query = "SELECT FROM Pharmacy WHERE pharmacy_id = %s"
                cursor.execute(query, (p_id,))
                result = cursor.fetchone()
                if not result:
                    return jsonify({"msg": "No pharmacy"}), 400
                
                ##check if medicine can be purchased(prescription check)
                med_list= request.json.get("medicine")

                medid_list= [str(med["id"]) for med in med_list]
                for med in med_list:
                    query = "SELECT * FROM patient_prescription WHERE med_id = %s"
                    cursor.execute(query, (p_id,))
                    result = cursor.fetchone()
                    if not result:
                        return jsonify({"msg": "Cant buy medicine not allowed"}), 400
                
                ##balance deduction
                query = "SELECT SUM(price) as total_price FROM Medicine WHERE med_id in (%s)"
                cursor.execute(query, (p_id,",".join(medid_list)))
                total_price = cursor.fetchone()

                cursor.execute("""
                    UPDATE Wallet 
                    SET balance = balance - ?
                    WHERE id = ((SELECT wallet_id FROM USER WHERE user_id = ?))
                    """, (total_price["total_price"], current_user))
                
                #deduct medicines from the storage of pharmacies
                for med in med_list:
                    cursor.execute("""
                    UPDATE StoredIn 
                    SET amount = amount - ? 
                    WHERE pharmacy_id = ? AND med_id = ?;
                    """, (med["quantity",p_id,med["id"]]))

                ## create a purchase object
                cursor.execute("SELECT wallet_id FROM User WHERE user_id = %s",(current_user))
                w_id= cursor.fetchone()
                cursor.execute("""
                    INSERT INTO Purchase (pharmacy_id, date, deduction, wallet_id, user_id) 
                    VALUES (?, ?, ?, ?, ?);
                    """,(p_id,datetime.now().date().strftime('%Y-%m-%d'),total_price["total_price"],w_id["wallet_id"],current_user))
                
                purchase_id = cursor.lastrowid
                ## create purchased medicine objects
                for med in med_list:
                    
                










                
            
                
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
        try:
            keys = ["id", "prescribed_by", "prescribed_to", "date", "type", "notes", "status"]
            cursor.execute(
                "select * from prescription where prescribed_to = %s",
                (current_user,)
            )
            prescriptions = cursor.fetchall()
            return [dict(zip(keys, row)) for row in prescriptions], 200
        except Exception as e:
            print(e)
            return jsonify({"msg": "Couldn't get prescription"}), 500


