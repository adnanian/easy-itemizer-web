from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates

class Membership(db.Model, SerializerMixin):
    """
    Binds users and organizations together.
    A user can belong to many organizations.
    An organization can have many users.
    A membership belongs to one user and one organization.
    
    Each member has one of the following three roles:
    
    REGULAR = Can add items to organization and adjust quantities.
    ADMIN = Have regular permissions, and can also remove items, as well as manage users and requests.
    OWNER = Have admin permssions, and can also edit and delete an organization.
    
    """
    
    __tablename__ = 'memberships'
    id = db.Column(db.Integer, primary_key=True)
    role = db.Column(db.Enum('REGULAR', 'ADMIN', 'OWNER', name='role_enum'), nullable=False)
    joined_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    last_updated = db.Column(db.DateTime, onupdate=db.func.now())
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'))
    # Relationships Established
    user = db.relationship('User', back_populates='memberships')
    organization = db.relationship('Organization', back_populates='memberships')
    
    def __repr__(self):
        return f"<Membership {self.id}, {self.role}, {self.joined_at}, {self.last_updated}, {self.user_id}, {self.organization_id}>"
    