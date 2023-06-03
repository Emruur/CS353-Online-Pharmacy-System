from datetime import datetime

import mysql
from flask import Blueprint, g, jsonify, request
from config import db_config
from flask_jwt_extended import (
    JWTManager, jwt_required, create_access_token,
    get_jwt_identity
)
pharmacy_blueprint = Blueprint('pharmacy', __name__)
db_config = db_config
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)

def get_conn():
    if 'conn' not in g:
        g.conn = pool.get_connection()
    return g.conn


@pharmacy_blueprint.teardown_app_request
def close_conn(e):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()

@pharmacy_blueprint.route('/register_drug', methods=['POST'])
@jwt_required()
def register():
    current_user = get_jwt_identity()
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Pharmacist WHERE user_id = %s", (current_user,))
    pharmacist = cursor.fetchone()
    
    if pharmacist:
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        try:
            med_name = request.json.get('med_name', None)
            med_dosage = request.json.get('med_dosage', None)
            med_type = request.json.get('med_type', None)
            med_used_for = request.json.get('med_used_for', None)
            med_age = request.json.get('med_age', None)
            med_presc_type = request.json.get('med_presc_type', None)
            med_side_effects = request.json.get('med_side_effects', None)
            med_risk_factors = request.json.get('med_risk_factors', None)
            med_preserve_cond = request.json.get('med_preserve_cond', None)
            med_prod_firm = request.json.get('med_prod_firm', None)
            med_price = request.json.get('med_price', None)

            cursor.execute(
                """INSERT INTO Medicine (name, prescription_type, used_for, dosages, side_effects,
                    risk_factors, preserve_conditions, prod_firm, price, med_type, min_age) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)""",
                (med_name, med_presc_type, med_used_for, med_dosage, med_side_effects, med_risk_factors, med_preserve_cond,
                    med_prod_firm, med_price, med_type, med_age)
            )
            conn.commit()
            last_inserted_id = cursor.lastrowid

            cursor.execute(
                "SELECT pharmacy_id FROM Pharmacist WHERE user_id = %s",
                (pharmacist[0],)
            )
            pharmacy_id = cursor.fetchone()[0]

            cursor.execute(
                "INSERT INTO StoredIn (pharmacy_id, med_id, amount) VALUES (%s, %s, %s)",
                (pharmacy_id, last_inserted_id, 1)
            )
            conn.commit()

            return jsonify({"msg": "Medicine is registered successfully"}), 200
        except Exception as e:
            conn.rollback()
            return f'Transaction failed: {str(e)}', 500

    else:
        return jsonify({"msg": "Only Pharmacists can register new drugs"}), 405

@pharmacy_blueprint.route('/delete_drug/<id>', methods=['DELETE'])
@jwt_required()
def delete(id):
    current_user = get_jwt_identity()
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Pharmacist WHERE user_id = %s", (current_user,))
    pharmacist = cursor.fetchone()
    
    if pharmacist:
        if not request.is_json:
            return jsonify({"msg": "Missing JSON in request"}), 400
        try:
            cursor.execute(
                "SELECT pharmacy_id FROM Pharmacist WHERE user_id = %s",
                (pharmacist[0],)
            )
            pharmacy_id = cursor.fetchone()[0]

            cursor.execute(
                "SELECT * FROM StoredIn WHERE med_id = %s",
                (id,)
            )
            stored = cursor.fetchall()
            if not stored:
                return jsonify({"msg": "No drug registered with this id!"}), 405

            cursor.execute(
                "DELETE FROM StoredIn WHERE pharmacy_id = %s AND med_id = %s",
                (pharmacy_id, id)
            )
            conn.commit()

            cursor.execute(
                "SELECT * FROM StoredIn WHERE med_id = %s AND pharmacy_id <> %s",
                (id, pharmacy_id)
            )
            othermedicines = cursor.fetchall()

            if othermedicines:
                pass
            else:
                cursor.execute(
                "DELETE FROM Medicine WHERE med_id = %s",
                (id,)
            )
            conn.commit()

            return jsonify({"msg": "Medicine is removed successfully"}), 200
        except Exception as e:
            conn.rollback()
            return f'Transaction failed: {str(e)}', 500

    else:
        return jsonify({"msg": "Only Pharmacists can remove drugs"}), 405


@pharmacy_blueprint.route('/mypharmacy', methods=['GET', 'PUT'])
@jwt_required()
def getMedicines():
    current_user = get_jwt_identity()
    conn = get_conn()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM Pharmacist WHERE user_id = %s", (current_user,))
    pharmacist = cursor.fetchone()
    
    if pharmacist:
        if request.method == 'GET':
            try:
                keys = ["med_id", "amount", "name", "prescription_type", "used_for", "dosages", "side_effects", "risk_factors",
                        "preserve_conditions","prod_firm", "price", "med_type", "min_age"]
                cursor.execute(
                    "SELECT pharmacy_id FROM Pharmacist WHERE user_id = %s",
                    (pharmacist[0],)
                )
                pharmacy_id = cursor.fetchone()[0]

                cursor.execute(
                    "SELECT * FROM StoredIn NATURAL JOIN Medicine WHERE pharmacy_id = %s",
                    (pharmacy_id,)
                )
                medicines = cursor.fetchall()
                return [dict(zip(keys, row)) for row in medicines], 200
            except Exception as e:
                conn.rollback()
                return f'Transaction failed: {str(e)}', 500
            
        if request.method == 'PUT':
            if not request.is_json:
                return jsonify({"msg": "Missing JSON in request"}), 400
            try:
                med_id = request.json.get('med_id', None)
                med_no = request.json.get('med_no', None)
                cursor.execute(
                    "SELECT pharmacy_id FROM Pharmacist WHERE user_id = %s",
                    (pharmacist[0],)
                )
                pharmacy_id = cursor.fetchone()[0]

                cursor.execute(
                    "UPDATE StoredIn SET amount = %s WHERE pharmacy_id = %s AND med_id = %s",
                    (med_no, pharmacy_id, med_id)
                )
                conn.commit()
                updatedRows = cursor.rowcount

                if updatedRows < 1:
                    return jsonify({"msg": "Medicine is not found in the system!"}), 200
                else:
                    return jsonify({"msg": "Medicine is updated successfully"}), 200
            except Exception as e:
                conn.rollback()
                return f'Transaction failed: {str(e)}', 500
    else:
        return jsonify({"msg": "Only Pharmacists can view the editing page"}), 405

# method to get all pharmacies
@pharmacy_blueprint.route('/allPharmacies', methods=['GET'])
def getAllPharmacies():
    conn = get_conn()
    cursor = conn.cursor()

    try:
        keys = ["hospital_id", "address_id", "name"]
        cursor.execute(
            "SELECT * FROM Pharmacy"
        )
        pharmacies = cursor.fetchall()
        return [dict(zip(keys, row)) for row in pharmacies], 200
    
    except Exception as e:
        conn.rollback()
        return f'Transaction failed: {str(e)}', 500