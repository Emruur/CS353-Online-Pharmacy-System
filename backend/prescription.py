from datetime import datetime

import mysql
from flask import Blueprint, g, jsonify, request
from config import db_config
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
prescription_blueprint = Blueprint('prescription', __name__)
db_config = db_config
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

def get_conn():
    if 'conn' not in g:
        g.conn = pool.get_connection()
    return g.conn


@prescription_blueprint.teardown_app_request
def close_conn(e):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()

@prescription_blueprint.route('/prescribe', methods=['POST'])
@jwt_required()
def prescribe():
    current_user = get_jwt_identity()
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("select * from doctor where user_id = %s", (current_user,))
    doctor = cursor.fetchone()
    if doctor:
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        try:
            prescribed_by_value = current_user
            prescribed_to_value = request.json.get('prescribed_to', None)
            date_now_value = datetime.today().strftime('%Y-%m-%d')
            pres_type_value = request.json.get('type', None)
            notes_value = request.json.get('notes', None)
            medicine = request.json.get('medicine', None)
            status_value = "valid"
            cursor.execute(
                "INSERT INTO prescription (prescribed_by, prescribed_to, `date`, `type`, notes, status) VALUES (%s, %s, %s, %s, %s, %s)",
                (prescribed_by_value, prescribed_to_value, date_now_value, pres_type_value, notes_value, status_value)
            )
            conn.commit()
            last_inserted_id = cursor.lastrowid

            for med in medicine:
                print(type(med))

                cursor.execute(
                    "insert into prescribedmedication (pres_id,med_id) VALUES (%s,%s)",
                    (last_inserted_id, med))
                conn.commit()
            return jsonify({"msg": "Prescription created successfully"}), 200
        except Exception as e:
            conn.rollback()
            return f'Transaction failed: {str(e)}', 500

    else:
        return jsonify({"msg": "Only doctors can create prescription"}), 405
