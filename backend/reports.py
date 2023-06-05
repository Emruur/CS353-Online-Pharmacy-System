import mysql
from flask import Blueprint, g, request, jsonify
from config import db_config

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

reports_blueprint = Blueprint('reports', __name__)
db_config = db_config
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)


def get_conn():
    if 'conn' not in g:
        g.conn = pool.get_connection()
    return g.conn


@reports_blueprint.teardown_app_request
def close_conn(e):
    conn = g.pop('conn', None)
    if conn is not None:
        conn.close()




@reports_blueprint.route('/sold-medicine', methods=['GET'])
@jwt_required()
def sold_med_report():
    """
    only pharmacists can view this report for their pharmacy. returns the names of sold drugs within a
    date range
    http://127.0.0.1:5000/reports/sold-medicine
    request form:
    {
    "start_date": "2023-06-20",
    "end_date": "2023-06-23"
    }

    """
    conn = get_conn()
    cursor = conn.cursor()
    current_user = get_jwt_identity()
    start_date = request.json.get('start_date', None)
    end_date = request.json.get('end_date', None)

    try:
        if start_date and end_date:
            cursor.execute("select * from Pharmacist where user_id = %s",(current_user,))
            pharmacist = cursor.fetchone()
            if pharmacist is not None:
                pharmacy_id = pharmacist[2]
                cursor.execute("""
                                SELECT name, COUNT(*) 
                                FROM Medicine 
                                WHERE med_id IN (
                                    SELECT med_id 
                                    FROM PurchasedMedicine 
                                    JOIN Purchase p ON p.purchase_id = PurchasedMedicine.purchase_id 
                                    WHERE date BETWEEN %s AND %s 
                                    AND pharmacy_id = %s
                                )
                                GROUP BY name;
                """,
                               (start_date, end_date, pharmacy_id))

                result = cursor.fetchall()
                keys = ["name", "count"]
                result_with_keys = []

                for res in result:
                    result_with_keys.append(dict(zip(keys, res)))

                return jsonify({"msg": "Report generated!", "result": result_with_keys}), 200
            return jsonify({"msg": "Only pharmacists can view reports!"}), 401
        return jsonify({"msg": "Enter dates!"}), 400
    except Exception as e:
        print(e)
        return jsonify({"msg": "error"}), 500


@reports_blueprint.route('/min-max-age', methods=['GET'])
@jwt_required()
def max_min_rep():
    """
    only pharmacists can view this report for their pharmacy. returns the names and max-min buyers of sold drugs within a
    date range
    http://127.0.0.1:5000/reports/min-max-age
    request form:
    {
    "start_date": "2023-06-20",
    "end_date": "2023-06-23"
    }

    """
    conn = get_conn()
    cursor = conn.cursor()
    current_user = get_jwt_identity()
    start_date = request.json.get('start_date', None)
    end_date = request.json.get('end_date', None)

    try:
        if start_date and end_date:
            cursor.execute("select * from Pharmacist where user_id = %s",(current_user,))
            pharmacist = cursor.fetchone()
            if pharmacist is not None:
                pharmacy_id = pharmacist[2]
                cursor.execute("""
                SELECT name, MAX(age) AS max, MIN(age) AS min
                    FROM Medicine
                    JOIN PurchasedMedicine p ON Medicine.med_id = p.med_id
                    JOIN Purchase ON Purchase.purchase_id = p.purchase_id
                    JOIN Patient ON Purchase.user_id = Patient.user_id
                    WHERE Purchase.pharmacy_id = %s
                        AND Purchase.date BETWEEN %s AND %s
                    GROUP BY name;
                """,
                               (pharmacy_id, start_date, end_date))

                result = cursor.fetchall()
                keys = ["name", "max", "min"]
                result_with_keys = []

                for res in result:
                    result_with_keys.append(dict(zip(keys, res)))

                return jsonify({"msg": "Report generated!", "result": result_with_keys}), 200
            return jsonify({"msg": "Only pharmacists can view reports!"}), 401

    except Exception as e:
        print(e)
        return jsonify({"msg": "error"}), 500


@reports_blueprint.route('/avg-revenue', methods=['GET'])
@jwt_required()
def avg_revenue():
    """
    only pharmacists can view this report for their pharmacy. returns the yearly average revenue by producing firm
    http://127.0.0.1:5000/reports/avg-revenue
    request form:
    {
        "type": "prod_firm" OR used_for ~ report generated on either prod_firm or drug_type not both! add a dropdown in UI
    }

    """
    conn = get_conn()
    cursor = conn.cursor()
    current_user = get_jwt_identity()
    type = request.json.get('type', None)

    try:
        if type:
            cursor.execute("select * from Pharmacist where user_id = %s",(current_user,))
            pharmacist = cursor.fetchone()
            if pharmacist is not None:
                pharmacy_id = pharmacist[2]
                #TODO: average neye göre average? şu an total revenue / 12 yıllık hesap
                query = f"SELECT {type}, SUM(price)/12 FROM PurchasedMedicine p " \
                        f"JOIN Medicine m ON m.med_id = p.med_id " \
                        f"WHERE p.purchase_id IN (SELECT purchase_id FROM Purchase WHERE Purchase.pharmacy_id = %s) " \
                        f"GROUP BY {type}"

                cursor.execute(query, (pharmacy_id,))

                result = cursor.fetchall()
                keys = [type, "avg_revenue"]
                result_with_keys = []

                for res in result:
                    result_with_keys.append(dict(zip(keys, res)))

                return jsonify({"msg": "Report generated!", "result": result_with_keys}), 200
        return jsonify({"msg": "Only pharmacists can view reports!"}), 401

    except Exception as e:
        print(e)
        return jsonify({"msg": "error"}), 500


@reports_blueprint.route('/max-purchased', methods=['GET'])
@jwt_required()
def max_purchased():
    """
    only pharmacists can view this report for their pharmacy. returns the yearly average revenue by producing firm
    http://127.0.0.1:5000/reports/max-purchased
    request form:
    {
        "type": "prod_firm" OR used_for ~ report generated on either prod_firm or drug_type not both! add a dropdown in UI
    }

    """
    conn = get_conn()
    cursor = conn.cursor()
    current_user = get_jwt_identity()
    type = request.json.get('type', None)

    try:
        if type:
            cursor.execute("select * from Pharmacist where user_id = %s",(current_user,))
            pharmacist = cursor.fetchone()
            if pharmacist is not None:
                pharmacy_id = pharmacist[2]
                query = f'''
                        SELECT p.{type}, p.name, p.purchase_count
                        FROM (
                            SELECT m.name, m.{type}, SUM(pm.purchase_count) AS purchase_count
                            FROM Medicine m
                            JOIN Purchasedmedicine pm ON m.med_id = pm.med_id
                            JOIN Purchase pu ON pu.purchase_id = pm.purchase_id
                            WHERE pu.pharmacy_id = {pharmacy_id}
                            GROUP BY m.name, m.{type}
                        ) AS p
                        JOIN (
                            SELECT {type}, MAX(purchase_count) AS max_count
                            FROM (
                                SELECT m.name, m.{type}, SUM(pm.purchase_count) AS purchase_count
                                FROM Medicine m
                                JOIN PurchasedMedicine pm ON m.med_id = pm.med_id
                                JOIN Purchase pu ON pu.purchase_id = pm.purchase_id
                                GROUP BY m.name, m.{type}
                            ) AS purchase_cnt
                            GROUP BY {type}
                        ) AS max_purchases ON p.{type} = max_purchases.{type} AND p.purchase_count = max_purchases.max_count;
                        '''
                cursor.execute(query)
                result = cursor.fetchall()
                keys = [type, "name", "count"]
                result_with_keys = []

                for res in result:
                    result_with_keys.append(dict(zip(keys, res)))

                return jsonify({"msg": "Report generated!", "result": result_with_keys}), 200
        return jsonify({"msg": "Only pharmacists can view reports!"}), 401

    except Exception as e:
        print(e)
        return jsonify({"msg": "error"}), 500


@reports_blueprint.route('/monthly-revenue', methods=['GET'])
@jwt_required()
def monthly_revenue():
    """
    only pharmacists can view this report for their pharmacy. returns the yearly average revenue by producing firm
    http://127.0.0.1:5000/reports/monthly-revenue
    request form:
    {
        "year": 2023
    }

    """
    conn = get_conn()
    cursor = conn.cursor()
    current_user = get_jwt_identity()
    year = request.json.get('year', None)

    try:
        if year:
            cursor.execute("select * from Pharmacist where user_id = %s",(current_user,))
            pharmacist = cursor.fetchone()
            if pharmacist is not None:
                pharmacy_id = pharmacist[2]
                query = f'''
                            SELECT
                            MONTH(p.date) AS month,
                            SUM(p.deduction) AS monthly_revenue
                        FROM
                            Purchase p
                        WHERE
                            YEAR(p.date) = {year} AND pharmacy_id = {pharmacy_id}
                        GROUP BY
                            MONTH(p.date)
                        '''
                cursor.execute(query)
                result = cursor.fetchall()
                keys = ["month", "revenue"]
                result_with_keys = []

                for res in result:
                    result_with_keys.append(dict(zip(keys, res)))

                return jsonify({"msg": "Report generated!", "result": result_with_keys}), 200
        return jsonify({"msg": "Only pharmacists can view reports!"}), 401

    except Exception as e:
        print(e)
        return jsonify({"msg": "error"}), 500
