from flask import Flask
from flask_cors import CORS
from users import users_blueprint
from auth import auth_blueprint
from prescription import prescription_blueprint
from medicine import medicine_blueprint
from flask_jwt_extended import JWTManager

# Configuration for Flask-JWT-Extended
app = Flask(__name__)
cors = CORS(app)
app.config['JWT_SECRET_KEY'] = 'cs353pharmacy'  # replace 'your-secret-key' with your actual secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400  # the number of seconds until the token expires, you can adjust this as needed

jwt = JWTManager(app)

app.register_blueprint(users_blueprint, url_prefix='/users')
app.register_blueprint(auth_blueprint, url_prefix='/auth')
app.register_blueprint(prescription_blueprint, url_prefix='/prescription')
app.register_blueprint(medicine_blueprint, url_prefix='/medicine')


if __name__ == '__main__':
    app.run(debug=True)
