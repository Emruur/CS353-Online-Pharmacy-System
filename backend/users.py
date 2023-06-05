from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
import mysql.connector
from mysql.connector import pooling
from config import db_config
users_blueprint = Blueprint('users', __name__)

db_config = db_config

# Initialize the MySQL connection pool
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

def get_conn():
    if 'conn' not in g:
        g.conn = pool.get_connection()
    return g.conn

@users_blueprint.teardown_app_request
def close_conn(e):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()

@users_blueprint.route('/', methods=['POST'])
def add_user():
    data = request.get_json()
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO User(id,email) VALUES (%s, %s)", (data['id'], data['email']))
    conn.commit()
    return jsonify({'message': 'User added successfully'}), 201

@users_blueprint.route('/', methods=['GET'])
def get_users():
    conn = get_conn()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM User")
    users = cursor.fetchall()
    return jsonify(users), 200

@users_blueprint.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (id,))
    conn.commit()
    return jsonify({'message': 'User deleted successfully'}), 200

@users_blueprint.route('/getProfile', methods=['GET'])
@jwt_required()
def getProfile():
    current_user = get_jwt_identity()
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT email, first_name, middle_name, surname, phone_number FROM Patient NATURAL JOIN User WHERE user_id = %s", (current_user,))
    patient = cursor.fetchone()

    try:
        keys = ["email", "first_name", "middle_name", "surname", "phone_number"]
        
        return [dict(zip(keys, patient))], 200
    
    except Exception as e:
        conn.rollback()
        return f'Transaction failed: {str(e)}', 500