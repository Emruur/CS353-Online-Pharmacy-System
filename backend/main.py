from flask import Flask
from users import users_blueprint
from auth import auth_blueprint
from flask_jwt_extended import JWTManager

# Configuration for Flask-JWT-Extended
app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'cs353pharmacy'  # replace 'your-secret-key' with your actual secret key
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 86400  # the number of seconds until the token expires, you can adjust this as needed

jwt = JWTManager(app)


app.register_blueprint(users_blueprint, url_prefix='/users')
app.register_blueprint(auth_blueprint, url_prefix='/auth')

if __name__ == '__main__':
    app.run(debug=True)
