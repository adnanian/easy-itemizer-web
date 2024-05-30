from sqlalchemy_serializer import SerializerMixin
from config import db

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
    is_public = db.Column(db.Boolean)
    
def __repr__(self):
    return f"<Item {self.id}, {self.name}, {self.description}, {self.part_number}, {self.is_public}"