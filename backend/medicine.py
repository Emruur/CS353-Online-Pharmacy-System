import mysql
from flask import Blueprint, g, request, jsonify
from config import db_config

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

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


"""
This route, defined as @app.route('/medicine', methods=['GET']), fetches all medicines from the database and allows optional filtering based on several criteria. 

The following query parameters can be used for filtering:

'name': filters medicines by their name. For example, to fetch all medicines with the name "Aspirin", you can send a GET request to /medicine?name=Aspirin.

'usage_purpose': filters medicines based on their usage purpose. For example, to fetch all medicines used for "Pain Relief", you can send a GET request to /medicine?usage_purpose=Pain%20Relief.

'risk_factors': filters medicines by their risk factors. For example, to fetch all medicines with a risk factor of "Nausea", you can send a GET request to /medicine?risk_factors=Nausea.

'producer_firm': filters medicines by their producer firm. For example, to fetch all medicines produced by "Pfizer", you can send a GET request to /medicine?producer_firm=Pfizer.

'price_min' and 'price_max': filters medicines based on their price range. For example, to fetch all medicines priced between 10 and 20, you can send a GET request to /medicine?price_min=10&price_max=20.

If no query parameters are used, the route will return all medicines in the database.

"http://localhost:5000/medicine?producer_firm=Pfizer"
"http://localhost:5000/medicine?risk_factors=Nausea"
"""

@medicine_blueprint.route('/', methods=['GET'])
@jwt_required()
def get_medicines():
    conn = get_conn()
    cursor = conn.cursor(dictionary=True)
    sql = "SELECT * FROM Medicine NATURAL LEFT JOIN StoredIn WHERE 1=1 "
    query_parameters = []

    # filtering according to name
    name = request.args.get('name')
    if name:
        sql += "AND name LIKE %s "
        query_parameters.append('%' + name + '%')

    # filtering according to usage purpose
    usage_purpose = request.args.get('used_for')
    if usage_purpose:
        sql += "AND used_for LIKE %s "
        query_parameters.append('%' + usage_purpose + '%')

    # filtering according to risk factors
    risk_factors = request.args.get('risk_factors')
    if risk_factors:
        sql += "AND risk_factors LIKE %s "
        query_parameters.append('%' + risk_factors + '%')

    # filtering according to producer firm
    prod_firm = request.args.get('prod_firm')
    if prod_firm:
        sql += "AND prod_firm LIKE %s "
        query_parameters.append('%' + prod_firm + '%')

    # filtering according to address 
    address = request.args.get('address_id')
    if address:
        sql += "AND address_id = %s "
        query_parameters.append(address)


    # filtering according to price range
    min_price = request.args.get('min_price')
    max_price = request.args.get('max_price')
    if min_price and max_price:
        sql += "AND price BETWEEN %s AND %s "
        query_parameters.append(min_price)
        query_parameters.append(max_price)

    # filtering according to address 
    p_id = request.args.get('pharmacy_id')
    if p_id:
        sql += "AND pharmacy_id = %s "
        query_parameters.append(p_id)

    cursor.execute(sql, query_parameters)
    medicines = cursor.fetchall()

    return jsonify(medicines), 200

    

@medicine_blueprint.route('/pharmacy_inventory/<int:pharmacy_id>', methods=['GET'])
@jwt_required()
def pharmacy_inventory():
    p_id = request.args.get('pharmacy_id')
    conn = get_conn()
    cursor = conn.cursor()

    query = "SELECT EXISTS (SELECT 1 FROM Pharmacy WHERE pharmacy_id = %s) as exists"
    cursor.execute(query, (p_id,))
    
    result = cursor.fetchone()
    if not bool(result["exists"]):
        return jsonify({"msg": "No pharmacy found with the id"}), 400


    return jsonify({"msg": "Pharmacy fnd"}), 200


