from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db, bcrypt
from sqlalchemy.ext.associationproxy import association_proxy
from models.membership import Membership
from helpers import is_non_empty_string


class User(db.Model, SerializerMixin):
    """
    Person that is physically using Easy Itemizer.
    A user can join organizations, make requests,
    add/remove items, and manage inventory.
    """

    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    first_name = db.Column(db.String, nullable=False)
    last_name = db.Column(db.String, nullable=False)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String, unique=True, nullable=False)
    _password_hash = db.Column(db.String)
    profile_picture_url = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    last_updated = db.Column(db.DateTime, onupdate=db.func.now())
    is_verified = db.Column(db.Boolean, default=False, nullable=False)
    is_banned = db.Column(db.Boolean, default=False, nullable=False)

    """
    1:M & M:M relationships established here
    """
    # users -< memberships >- organizations
    memberships = db.relationship(
        "Membership", back_populates="user", cascade="all, delete-orphan"
    )
    organizations = association_proxy(
        "memberships",
        "organization",
        creator=lambda org_obj: Membership(organization=org_obj),
    )
    # users -< items
    items = db.relationship("Item", back_populates="user")
    # users -< requests >- organizations
    requests = db.relationship(
        "Request", back_populates="user", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<User {self.id}, {self.first_name}, {self.last_name}, {self.username}, {self.email}, {self.created_at}, {self.last_updated}, {self.is_verified}, {self.is_banned}>"

    @validates("first_name", "last_name")
    def validate_name(self, key, name):
        """Validates that the name is a non-empty, non-unique string.

        Args:
            key (str): the attribute name.
            name (str): the name attribute value.

        Raises:
            ValueError: if name is NOT a non-empty string.

        Returns:
            str: the value of name..
        """
        if not is_non_empty_string(name):
            raise ValueError(f"{key.title()} must be a non-empty string.")
        return name

    @validates("username")
    def validate_username(self, key, username):
        """Validates that the username is a non-empty, non-unique string.

        Args:
            key (str): the attribute name.
            name (str): the username attribute value.

        Raises:
            ValueError: if username is NOT a non-empty string.
            ValueError: if username is not unique.

        Returns:
            str: the value of name..
        """
        if not (
            is_non_empty_string(username)
            and User.query.filter_by(username=username).first() is None
        ):
            raise ValueError(f"{key.title()} must be a unique, non-empty string.")
        return username
    
    @validates('email')
    def validate_email(self, key, email):
        """Validates that the email is unique and valid.

        Args:
            key (str): the attribute name.
            email (str): the attribute value.

        Raises:
            ValueError: if entered input is NOT already a validemail.
            ValueError: if entered email is already tied to another user.

        Returns:
            str: the value of email.
        """
        if ("@" not in email):
            raise ValueError(f"{key.title()} must be a valid email address.")
        elif User.query.filter_by(email=email).first():
            raise ValueError(f"An account with the {key}, {email}, already exists.")
        return email
    
    @hybrid_property
    def password_hash(self):
        """Restriction for user. Prevents user from accessing password hash.

        Raises:
            AttributeError: if an attempt to access the password hash has been made.
        """
        raise AttributeError("Password hash cannot be viewed.")
    
    @password_hash.setter
    def password_hash(self, password):
        """Sets a new password for user and rehashes it.

        Args:
            password (str): the new password.
        """
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')
        
    def authenticate(self, password):
        """Check if user entered the correct password.

        Args:
            password (str): the password

        Returns:
            bool: if user entered the correct password; False otherwise.
        """
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))