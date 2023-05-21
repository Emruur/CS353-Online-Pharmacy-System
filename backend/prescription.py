import mysql
from flask import Blueprint
from config import db_config
prescription_blueprint = Blueprint('prescription', __name__)
db_config = db_config
pool = mysql.connector.pooling.MySQLConnectionPool(pool_name="mypool", pool_size=5, **db_config)
