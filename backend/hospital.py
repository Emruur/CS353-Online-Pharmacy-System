from datetime import datetime

import mysql
from flask import Blueprint, g, jsonify, request
from config import db_config
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
hospital_blueprint = Blueprint('hospital', __name__)
db_config = db_config
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

def get_conn():
    if 'conn' not in g:
        g.conn = pool.get_connection()
    return g.conn


@hospital_blueprint.teardown_app_request
def close_conn(e):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()


# method to get all hospitals
@hospital_blueprint.route('/', methods=['GET'])
def getAllHospitals():
    conn = get_conn()
    cursor = conn.cursor()

    try:
        keys = ["hospital_id", "name", "address_id"]
        cursor.execute(
            "SELECT * FROM Hospital"
        )
        hospitals = cursor.fetchall()

        return [dict(zip(keys, row)) for row in hospitals], 200
    
    except Exception as e:
        conn.rollback()
        return f'Transaction failed: {str(e)}', 500