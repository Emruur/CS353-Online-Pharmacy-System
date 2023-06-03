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

# method to get all hospitals
@prescription_blueprint.route('/allPharmacies', methods=['GET'])
@jwt_required()
def getAllPharmacies():
    current_user = get_jwt_identity()
    conn = get_conn()
    cursor = conn.cursor()
    """ cursor.execute("SELECT * FROM Pharmacist WHERE user_id = %s", (current_user,))
    pharmacist = cursor.fetchone() """
    
    #if pharmacist:
    #if not request.is_json:
    #    return jsonify({"msg": "Missing JSON in request"}), 400
    try:
        cursor.execute(
            "SELECT * FROM Pharmacy"
        )
        pharmacies = cursor.fetchall()

        return jsonify({"msg": "Pharmacies are listed"}), 200
    
    except Exception as e:
        conn.rollback()
        return f'Transaction failed: {str(e)}', 500
    
@prescription_blueprint.route('/', methods=['POST', 'GET'])
@jwt_required()
def prescription():
    """
    prescription() can be used to create a new prescription object, or fetch all the prescriptions written for the logged
    in user. Requires authentication.

    http://localhost:5000/prescription
    post request is atomic
    post request data format:
    {
        "prescribed_to" : "11176269610",
        "type": "prescription type",
        "notes" : "prescription notes",
        "medicine" : [
                        {
                        "id": 1,
                         "quantity" : 5,
                        },
                        {
                        "id": 3,
                         "quantity" : 2,
                        },
                        ]

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
                prescribed_by_value = current_user
                prescribed_to_value = request.json.get('prescribed_to', None)
                date_now_value = datetime.today().strftime('%Y-%m-%d')
                pres_type_value = request.json.get('type', None)
                notes_value = request.json.get('notes', None)
                medicine = request.json.get('medicine', None)
                status_value = "valid"
                cursor.execute(
                    "INSERT INTO prescription (prescribed_by, prescribed_to, `date`, `type`, notes, status) VALUES (%s, %s, %s, %s, %s, %s)",
                    (prescribed_by_value, prescribed_to_value, date_now_value, pres_type_value, notes_value,
                     status_value)
                )
                last_inserted_id = cursor.lastrowid

                for med in medicine:
                    cursor.execute(
                        "insert into prescribedmedication (pres_id,med_id,med_count) VALUES (%s,%s, %s)",
                        (last_inserted_id, med.get("id"), med.get("quantity")))
                conn.commit()
                return jsonify({"msg": "Prescription created successfully"}), 200
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


@prescription_blueprint.route('/<id>', methods=['GET', 'DELETE', 'PUT'])
@jwt_required()
def prescription_detail(id):
    """
        prescription_detail() can be used to get presc by id, delete or update

        http://localhost:5000/prescription/<id>
        put request is atomic
        put request data format ("" or none fields won't change):
        {
            "prescribed_to" : "11176269610",
            "type": "prescription type",
            "notes" : "", -> past value will remain
            "medicine" : [1,3,4]

        }
        date is current time, status is valid by default.
        """
    conn = get_conn()
    cursor = conn.cursor()
    current_user = get_jwt_identity()
    if request.method == 'GET':
        keys = ["id", "prescribed_by", "prescribed_to", "date", "type", "notes", "status"]
        try:
            cursor.execute(
                "select * from prescription where pres_id = %s",
                (id,)
            )
            presc = cursor.fetchone()
            return [dict(zip(keys, presc))], 200
        except Exception as e:
            print(e)
            return jsonify({"msg": "Couldn't get prescription"}), 500
    if request.method == 'DELETE':
        try:
            cursor.execute(
                "delete from prescription where pres_id = %s",
                (id,)
            )
            cursor.commit()
            return jsonify({"msg": "Successfully deleted"}), 200
        except Exception as e:
            print(e)
            return jsonify({"msg": str(e)}), 500

    if request.method == 'PUT':
        cursor.execute("select * from doctor where user_id = %s", (current_user,))
        doctor = cursor.fetchone()
        if doctor:
            if not request.is_json:
                return jsonify({"msg": "Missing JSON in request"}), 400
            try:
                non_empty = False
                fields = {"prescribed_to": request.json.get('prescribed_to', None),
                          "type": request.json.get('type', None),
                          "medicine": request.json.get('medicine', None),
                          "status": request.json.get('status', None),
                          "notes": request.json.get('notes', None)}
                query = "update prescription set "
                for key, value in fields.items():
                    if value is not None and value != "" and key != "medicine":
                        non_empty = True
                        query += key + "= '" + str(value) + "',"
                # remove the last comma
                conn.autocommit = False
                query = query[0:len(query) - 1] + "where pres_id =" + str(id) + " and prescribed_by =" + current_user
                print(query)
                if non_empty:
                    cursor.execute(query)
                    cursor.execute("delete from prescribedmedication where pres_id = %s", (id,))
                    if fields.get("medicine", None) is not None:
                        for med in fields.get("medicine"):
                            cursor.execute(
                                "insert into prescribedmedication (pres_id,med_id) VALUES (%s,%s)",
                                (id, med))
                    conn.commit()
                return jsonify({"msg": "Prescription updated successfully"}), 200
            except Exception as e:
                conn.rollback()
                return f'Transaction failed: {str(e)}', 500
            finally:
                conn.autocommit = True

        else:
            return jsonify({"msg": "Only doctors can edit prescription"}), 405


@prescription_blueprint.route('/request', methods=['POST', 'GET'])
@jwt_required()
def requested_prescription():
    """
    make a prescription request as a patient

    http://localhost:5000/prescription/request
    post request data format:
    {
        "pres_id":5
    }
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
                pres_id = request.json.get("pres_id")
                cursor.execute("INSERT INTO RequestedPrescription (doctor_id, patient_id, pres_id, status) "
                               "SELECT (SELECT user_id from doctor d where d.user_id = p.prescribed_by) as doctor_id, prescribed_to, pres_id, 'pending' "
                               "FROM Prescription p "
                               "WHERE prescribed_to = %s AND pres_id = %s AND (status = 'used' or status = 'expired') ",
                               (current_user, pres_id))

                conn.commit()
                return jsonify({"msg": "Prescription requested successfully"}), 200
            except Exception as e:
                conn.rollback()
                return f'Transaction failed: {str(e)}', 500
            finally:
                conn.autocommit = True

        except Exception as e:
            return jsonify({"msg": str(e)}), 405

    elif request.method == 'GET':
        try:
            keys = ["prescribed_by", "prescribed_to", "status", "type", "notes", "pres_id","date"]
            cursor.execute(
                "select prescribed_by,prescribed_to, rp.status, type, notes, p.pres_id, date "
                "from requestedprescription rp join prescription p on rp.pres_id = p.pres_id where prescribed_to = %s",
                (current_user,)
            )
            prescriptions = cursor.fetchall()
            return [dict(zip(keys, row)) for row in prescriptions], 200
        except Exception as e:
            print(e)
            return jsonify({"msg": "Couldn't get requested prescription"}), 500
