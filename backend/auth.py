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
    cursor.execute("SELECT password, user_id, first_name, surname FROM User WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user is None or not bcrypt.checkpw(password.encode(), user['password'].encode()):
        return jsonify({"msg": "Bad email or password"}), 401

    additional_info = {"first_name": user['first_name'], "last_name": user["surname"]}
    access_token = create_access_token(identity=user['user_id'], additional_claims=additional_info)
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
    type_specific = request.json.get('type_specific', {})

    if not email or not user_id or not password or not first_name or not surname or not phone_number or not user_type:
        return jsonify({"msg": "Missing required parameters"}), 400

    # hash the password using bcrypt
    hashed_password = bcrypt.hashpw(password.encode(), bcrypt.gensalt())

    conn = get_conn()
    cursor = conn.cursor()
    
    # check if email, user_id or phone_number is already in use
    cursor.execute("SELECT email, user_id, phone_number FROM User WHERE email = %s OR user_id = %s OR phone_number = %s", (email, user_id, phone_number))
    existing_user = cursor.fetchone()
    if existing_user:
        return jsonify({"msg": "Email, User ID or Phone Number already in use"}), 400

    # insert new user
    cursor.execute("INSERT INTO User (user_id, email, password, first_name, middle_name, surname, phone_number, user_type) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                   (user_id, email, hashed_password, first_name, middle_name, surname, phone_number, user_type))
    conn.commit()

    # insert into the respective user_type table
    if user_type == 'patient':
        cursor.execute("INSERT INTO Patient (user_id, height, weight) VALUES (%s, %s, %s)",
                       (user_id, type_specific.get('height'), type_specific.get('weight')))
    elif user_type == 'doctor':
        cursor.execute("INSERT INTO Doctor (user_id, speciality) VALUES (%s, %s)",
                       (user_id, type_specific.get('speciality')))
    elif user_type == 'pharmacist':
        cursor.execute("INSERT INTO Pharmacist (user_id, education) VALUES (%s, %s)",
                       (user_id, type_specific.get('education')))
    else:
        return jsonify({"msg": "Invalid user_type"}), 400

    conn.commit()

    return jsonify({"msg": "User created successfully"}), 201



@auth_blueprint.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
