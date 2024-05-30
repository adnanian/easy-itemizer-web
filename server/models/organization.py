from sqlalchemy_serializer import SerializerMixin
from config import db

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
    
def __repr__(self):
    return f"<Organization {self.id}, {self.name}, {self.description}, {self.banner_url}, {self.created_at}, {self.last_updated}>"
    