from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from models.membership import Membership
from models.assignment import Assignment

class Organization(db.Model, SerializerMixin):
    """
    A group of related users managing a collection of items.
    An organization can have many requests to join.
    An organization has many memberships (users as members).
    An organization has many assignments (items asigned specifically for that org).
    A user can belong to many organizations.
    A membership, assignment, and request, can each belong to one user.
    """
    
    __tablename__ = 'organizations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String)
    image_url = db.Column(db.String)
    banner_url = db.Column(db.String)
    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    last_updated = db.Column(db.DateTime, onupdate=db.func.now())
    
    """
    M:M relationships established here
    """
    # organizations -< memberships >- users
    memberships = db.relationship('Membership', back_populates='organization', cascade='all, delete-orphan')
    users = association_proxy('memberships', 'user', creator=lambda user_obj: Membership(user=user_obj))
    # organizations -< assignments >- items
    assignments = db.relationship('Assignment', back_populates='organization', cascade='all, delete-orphan')
    items = association_proxy('assignments', 'item', creator=lambda item_obj: Assignment(item=item_obj))
    # organizations -< requests >- users
    requests = db.relationship('Request', back_populates='organization', cascade='all, delete-orphan')
    # organization -< organization_logs
    organization_logs = db.relationship('OrganizationLog', back_populates='organization', cascade='all, delete-orphan')
    
    
def __repr__(self):
    return f"<Organization {self.id}, {self.name}, {self.description}, {self.banner_url}, {self.created_at}, {self.last_updated}>"
    