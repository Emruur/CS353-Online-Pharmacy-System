import mysql
from flask import Blueprint, g, request, jsonify
from config import db_config

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
        "medicine" : [1,3,4]
        "pharmacy id"
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
                cursor.execute("INSERT INTO Purchase(pharmacy_id,date,deduction,)")


   
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


