from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy_serializer import SerializerMixin
from config import db, bcrypt
from sqlalchemy.ext.associationproxy import association_proxy
from models.membership import Membership

class User(db.Model, SerializerMixin):
    """
    Person that is physically using Itemizer.
    A user can join organizations, make requests,
    add/remove items, and manage inventory.
    """
    
    __tablename__ = 'users'
    
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
    memberships = db.relationship('Membership', back_populates='user', cascade='all, delete-orphan')
    organizations = association_proxy('memberships', 'organization', creator=lambda org_obj: Membership(organization=org_obj))
    # users -< items
    items = db.relationship('Item', back_populates='user')
    # users -< requests >- organizations
    requests = db.relationship('Request', back_populates='user', cascade='all, delete-orphan')
    
def __repr__(self):
    return f"<User {self.id}, {self.first_name}, {self.last_name}, {self.username}, {self.email}, {self.created_at}, {self.last_updated}, {self.is_verified}, {self.is_banned}>"
    
