import mysql
from flask import Blueprint, g, request, jsonify
from config import db_config

medicine_blueprint = Blueprint('medicine', __name__)
db_config = db_config
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)


def get_conn():
    if 'conn' not in g:
        g.conn = pool.get_connection()
    return g.conn


@medicine_blueprint.teardown_app_request
def close_conn(e):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()


@medicine_blueprint.route('/', methods=['GET'])
def get_all_medicine():
    conn = get_conn()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("select * from medicine")
    medicine = cursor.fetchall()
    return jsonify(medicine), 200
