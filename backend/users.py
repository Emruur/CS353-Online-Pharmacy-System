from flask import Blueprint, request, jsonify, g
import mysql.connector
from mysql.connector import pooling

users_blueprint = Blueprint('users', __name__)

db_config = {
    "host": "localhost",
    "user": "your_username",
    "password": "your_password",
    "database": "your_database",
}

# Initialize the MySQL connection pool
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

def get_conn():
    if 'conn' not in g:
        g.conn = pool.get_connection()
    return g.conn

@users_blueprint.teardown_appcontext
def close_conn(e):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()

@users_blueprint.route('/', methods=['POST'])
def add_user():
    data = request.get_json()
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO users (name, email) VALUES (%s, %s)", (data['name'], data['email']))
    conn.commit()
    return jsonify({'message': 'User added successfully'}), 201

@users_blueprint.route('/', methods=['GET'])
def get_users():
    conn = get_conn()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM users")
    users = cursor.fetchall()
    return jsonify(users), 200

@users_blueprint.route('/<int:id>', methods=['DELETE'])
def delete_user(id):
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM users WHERE id = %s", (id,))
    conn.commit()
    return jsonify({'message': 'User deleted successfully'}), 200
