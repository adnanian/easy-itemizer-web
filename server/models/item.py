from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from models.assignment import Assignment

class Item(db.Model, SerializerMixin):
    """
    Item used by people and organizations.
    An item has many assignments.
    An assignment belongs to one item.
    An item can be used in many organizations.
    An organization can have many assignments.
    """
    
    __tablename__ = 'items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    image_url = db.Column(db.String)
    part_number = db.Column(db.String)
    is_public = db.Column(db.Boolean, default=True, nullable=False)
    # Foreign Key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    """
    1:M & M:M relationships established here
    """
    # items >- users
    user = db.relationship('User', back_populates='items')
    # items -< assignments >- organizations
    assignments = db.relationship('Assignment', back_populates='item', cascade='all, delete-orphan')
    organizations = association_proxy('assignments', 'organization', creator=lambda org_obj: Assignment(organization=org_obj))
    
    
def __repr__(self):
    return f"<Item {self.id}, {self.name}, {self.description}, {self.part_number}, {self.is_public}"