from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from sqlalchemy.ext.associationproxy import association_proxy
from config import db
from models.assignment import Assignment
from helpers import is_non_empty_string

class Item(db.Model, SerializerMixin):
    """
    Item used by people and organizations.
    An item has many assignments.
    An assignment belongs to one item.
    An item can be used in many organizations.
    An organization can have many assignments.
    An item belongs to one user.
    A user can have many items.
    """
    
    serialize_rules = (
        '-assignments',
        '-organizations'
    )
    
    serialize_only = (
        'id',
        'name',
        'description',
        'image_url',
        'part_number',
        'is_public',
        'created_at',
        'last_updated'
        'user_id',
        'user.first_name',
        'user.last_name',
        'user.username',
        'user.email'
    )
    
    __tablename__ = 'items'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    image_url = db.Column(db.String)
    part_number = db.Column(db.String)
    is_public = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    last_updated = db.Column(db.DateTime, onupdate=db.func.now())
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
    
    @validates('name')
    def validate_name(self, key, name):
        """Validates that the name is a non-empty, non-unique string.

        Args:
            key (str): the attribute name.
            name (str): the name attribute value.

        Raises:
            ValueError: if name is NOT a non-empty string.
            ValueError: if name is not unique.

        Returns:
            str: the value of name..
        """
        if not is_non_empty_string(name):
            raise ValueError(f"{key.title()} must be a non-empty string.")
        if Item.query.filter_by(name=name).first():
            raise ValueError(f"An item with name, {name}, already exists.")
        return name