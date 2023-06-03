from flask import Blueprint, request, jsonify, g, current_app, Response
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
import mysql.connector
from mysql.connector import pooling
import bcrypt
from config import db_config
import datetime

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
    cursor.execute("SELECT password, user_id, first_name, surname, user_type FROM User WHERE email = %s", (email,))
    user = cursor.fetchone()

    if user is None or not bcrypt.checkpw(password.encode(), user['password'].encode()):
        return jsonify({"msg": "Bad email or password"}), 401

    additional_info = {"first_name": user['first_name'], "last_name": user["surname"], "role": user["user_type"]}
    access_token = create_access_token(identity=user['user_id'], additional_claims=additional_info)
    return jsonify(access_token=access_token), 200


patient_specific_fields = ['height', 'weight', 'birthday']
doctor_specific_fields = ['speciality','hospital_id']
pharmacist_specific_fields = ['education','pharmacy_id']
    
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
    print(type_specific)

    ''' EXAMPLE JSON REQUEST
    {
    "user_id": "29256389766",
    "email": "patient@test.com",
    "password": "testpassword",
    "first_name": "Pat",
    "middle_name": "Doe",
    "surname": "Smith",
    "phone_number": "+1434567892",
    "user_type": "patient",
    "type_specific": {
        "height": "178",
        "weight": "77",
        "birthday": "2002-03-28" (BIRTHDAY FORMAT:  yyyy-mm-dd)
    }
    '''

    if not email or not user_id or not password or not first_name or not surname or not phone_number or not user_type or not type_specific:
        return jsonify({"msg": "Missing required parameters"}), 400
    
    if user_type== "patient":
        for field in patient_specific_fields:
            if field not in type_specific:
                return jsonify({"msg": "Type_specific data does not match patient"}), 400
    if user_type== "doctor":
        for field in doctor_specific_fields:
            if field not in type_specific:
                return jsonify({"msg": "Type_specific data does not match doctor"}), 400
    if user_type== "pharmacist":
        for field in pharmacist_specific_fields:
            if field not in type_specific:
                return jsonify({"msg": "Type_specific data does not match pharmacist"}), 400


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
    cursor.execute("INSERT INTO Wallet (balance) VALUES  (0)")
    conn.commit()
    last = cursor.lastrowid
    cursor.execute("INSERT INTO User (user_id, email, password, first_name, middle_name, surname, phone_number, user_type) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)",
                   (user_id, email, hashed_password, first_name, middle_name, surname, phone_number, user_type))
    conn.commit()

    # insert into the respective user_type table
    try:
        cursor.execute("INSERT INTO Patient (user_id, height, weight, birthday,wallet_id) VALUES (%s, %s, %s,%s,%s)",
                        (user_id, type_specific.get('height'), type_specific.get('weight'), type_specific.get("birthday"),last))
        if user_type == 'doctor':
            cursor.execute("INSERT INTO Doctor (user_id, speciality, hospital_id) VALUES (%s, %s, %s)",
                        (user_id, type_specific.get('speciality'),type_specific.get('hospital_id')))
            print(cursor)
        elif user_type == 'pharmacist':
            cursor.execute("INSERT INTO Pharmacist (user_id, education,pharmacy_id) VALUES (%s, %s,%s)",
                        (user_id, type_specific.get('education'),type_specific.get('pharmacy_id')))
        elif user_type != 'patient':
            return jsonify({"msg": "Invalid user_type"}), 400
    except Exception as e:
        print(e)
        cursor.execute("DELETE FROM User WHERE user_id = %s", (user_id,))
        conn.commit()
        return jsonify({"msg": "Invalid type_specific data"}), 400

    conn.commit()

    return jsonify({"msg": "User created successfully"}), 201

@auth_blueprint.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200
