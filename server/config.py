# Standard library imports
import os
# Remote library imports
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_restful import Api
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_mail import Mail, Message
from sqlalchemy import MetaData
import secrets
from itsdangerous import URLSafeTimedSerializer
from dotenv import load_dotenv
load_dotenv()

# Local imports


# deployed version uncomment below code, local version comment out below code
# app = Flask(
#     __name__,
#     static_url_path='',
#     static_folder='../client/dist',
#     template_folder='../client/dist'
# )

# Instantiate app, set attributes

# deployed version comment out below code, local version comment in below code
#app = Flask(__name__)

# Instantiate app, set attributes
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv("DATABASE_URI")
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False
app.secret_key = secrets.token_hex(16)
app.config['MAIL_SERVER']= os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['SECURITY_PASSWORD_SALT'] = os.getenv('SECURITY_PASSWORD_SALT')
mail = Mail(app) 




# Define metadata, instantiate db
metadata = MetaData(naming_convention={
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s"
})

db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app, resources={r"/*": {"origins": "*"}})


bcrypt = Bcrypt(app)

# Source: https://realpython.com/handling-email-confirmation-in-flask/

def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    return serializer.dumps(email, salt=app.config['SECURITY_PASSWORD_SALT'])

def confirm_token(token, expiration=3600):
    seralizer = URLSafeTimedSerializer(app.config['SECRET_KEY'])
    try:
        email = seralizer.loads(
            token,
            salt=app.config['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
    except:
        return False
    return email

def send_email(subject, recipients, template, sender=app.config['MAIL_DEFAULT_SENDER']):
    """
    Sends an email.

    Args:
        subject (string): the subject of the email.
        recipients (list): the list of recipients of the email.
        template (html document): the contents of the email.
        sender (string, optional): the sender. Defaults to app.config['MAIL_DEFAULT_SENDER'].
    """
    message = Message(
        subject=subject,
        recipients=recipients,
        html=template,
        sender=sender
    )
    mail.send(message)