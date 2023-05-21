from flask import Blueprint, request, jsonify, g, current_app
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
import mysql.connector
from mysql.connector import pooling
import bcrypt
from config import db_config
auth_blueprint = Blueprint('auth', __name__)

db_config = db_config

# Initialize the MySQL connection pool
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)


def get_conn():
    if 'conn' not in g:
        g.conn = pool.get_connection()
    return g.conn


@auth_blueprint.teardown_app_request
def close_conn(e):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()


@auth_blueprint.route('/login', methods=['POST'])
def login():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    email = request.json.get('email', None)
    password = request.json.get('password', None)

    if not email:
        return jsonify({"msg": "Missing email parameter"}), 400
    if not password:
        return jsonify({"msg": "Missing password parameter"}), 400

    conn = get_conn()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT password,user_id FROM User WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user is None or not bcrypt.checkpw(password.encode(), user['password'].encode()):
        return jsonify({"msg": "Bad email or password"}), 401

    access_token = create_access_token(identity=user['user_id'])
    return jsonify(access_token=access_token), 200


@auth_blueprint.route('/signup', methods=['POST'])
def signup():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    # get user data from request
    email = request.json.get('email', None)
    user_id = request.json.get('user_id', None)
    password = request.json.get('password', None)
    first_name = request.json.get('first_name', None)
    middle_name = request.json.get('middle_name', None)
    surname = request.json.get('surname', None)
    phone_number = request.json.get('phone_number', None)
    user_type = request.json.get('user_type', None)

    # hash the password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("INSERT INTO User (user_id,email, password, first_name, middle_name, surname, phone_number, user_type) VALUES (%s,%s, %s, %s, %s, %s, %s, %s)",
                   (user_id,email, hashed_password, first_name, middle_name, surname, phone_number, user_type))
    conn.commit()

    return jsonify({"msg": "User created successfully"}), 201


@auth_blueprint.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
