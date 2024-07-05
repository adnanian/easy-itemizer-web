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
from apscheduler.schedulers.background import BackgroundScheduler

load_dotenv()

# Local imports

# def configure_server():
#     """Creates and returns new instance of Flask with the appropriate attributes.
#     The attributes depend on the configuration type.

#     Raises:
#         ValueError: if the configuration type read from configType.txt is neither DEVELOPMENT nor SERVER.

#     Returns:
#         Flask: the appropriate instation of Flask for this application.
#     """
#     with open("../configType.txt", encoding="utf-8") as mode:
#         config_type = mode.read()
#     if config_type.lower() == 'development':
#         return Flask(__name__)
#     elif config_type.lower() == 'production':
#         return Flask(
#             __name__,
#             static_url_path="",
#             static_folder="../client/dist",
#             template_folder="../client/dist",
#         )
#     else:
#         raise ValueError("Invalid configuration type processed.")
    
def get_route_configuration_type():
    with open("../configType.txt", encoding="utf-8") as mode:
        config_type = mode.read()
    config_type = config_type.lower()
    if config_type in ["development", "production"]:
        return config_type
    else:
        raise ValueError("Invalid configuration type processed.")

SERVER_CONFIGS = {
    "development": {
        "app": Flask(__name__),
        "home_page": "http://localhost:3000",
        "route_prefix": "http://localhost:3000/api"
    },
    "production": {
        "app": Flask(
            __name__,
            static_url_path="",
            static_folder="../client/dist",
            template_folder="../client/dist",
        ),
        "home_page": "https://www.easyitemizer.com",
        "route_prefix": "https://www.easyitemizer.com"
    }
}

# Get configuration type and instantiate app & other appropriate variables based on config type.
CONFIG_TYPE = get_route_configuration_type()
app = SERVER_CONFIGS[CONFIG_TYPE]["app"]
home_page = SERVER_CONFIGS[CONFIG_TYPE]["home_page"]
route_prefix = SERVER_CONFIGS[CONFIG_TYPE]["route_prefix"]
# Set app attributes
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
app.json.compact = False
app.secret_key = secrets.token_hex(16)
app.config["MAIL_SERVER"] = os.getenv("MAIL_SERVER")
app.config["MAIL_PORT"] = 587
app.config["MAIL_USERNAME"] = os.getenv("MAIL_USERNAME")
app.config["MAIL_PASSWORD"] = os.getenv("MAIL_PASSWORD")
app.config["MAIL_USE_TLS"] = True
app.config["MAIL_USE_SSL"] = False
app.config["MAIL_DEFAULT_SENDER"] = os.getenv("MAIL_DEFAULT_SENDER")
app.config["SECURITY_PASSWORD_SALT"] = os.getenv("SECURITY_PASSWORD_SALT")
mail = Mail(app)
scheduler = BackgroundScheduler()


# Define metadata, instantiate db
metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)

db = SQLAlchemy(metadata=metadata)
migrate = Migrate(app, db)
db.init_app(app)

# Instantiate REST API
api = Api(app)

# Instantiate CORS
CORS(app)


bcrypt = Bcrypt(app)

# Source: https://realpython.com/handling-email-confirmation-in-flask/


def generate_confirmation_token(email):
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    # print(serializer, flush=True)
    return serializer.dumps(email, salt=app.config["SECURITY_PASSWORD_SALT"])


def confirm_token(token, expiration=600):
    seralizer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    try:
        email = seralizer.loads(
            token, salt=app.config["SECURITY_PASSWORD_SALT"], max_age=expiration
        )
    except:
        return False
    return email

def generate_invitation_token(org_name):
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    return serializer.dumps(org_name, salt=app.config["SECURITY_PASSWORD_SALT"])

def invitation_token(token, expiration=300):
    seralizer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    try:
        org_name = seralizer.loads(
            token, salt=app.config["SECURITY_PASSWORD_SALT"], max_age=expiration
        )
    except:
        return False
    return org_name

def generate_password_reset_link(salted_email):
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    return serializer.dumps(salted_email, salt=app.config["SECURITY_PASSWORD_SALT"])

def password_reset_token(token, expiration=120):
    seralizer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    try:
        salted_email = seralizer.loads(
            token, salt=app.config["SECURITY_PASSWORD_SALT"], max_age=expiration
        )
    except:
        return False
    return salted_email

def send_email(subject, recipients, template, sender=app.config["MAIL_DEFAULT_SENDER"]):
    """
    Sends an email.

    Args:
        subject (string): the subject of the email.
        recipients (list): the list of recipients of the email.
        template (html document): the contents of the email.
        sender (string, optional): the sender. Defaults to app.config['MAIL_DEFAULT_SENDER'].
    """
    message = Message(
        subject=subject, recipients=recipients, html=template, sender=sender
    )
    # print(message, flush=True)
    mail.send(message)