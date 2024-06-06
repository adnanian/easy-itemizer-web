from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates

# Requests to join an organization.
class Request(db.Model, SerializerMixin):
    """
    Connects an organization and user together.
    An organization can have many users (requesting to join).
    A request can be made in many organizations.
    A request belongs to one organization and one user.
    """
    
    __tablename__ = 'requests'
    id = db.Column(db.Integer, primary_key=True)
    reason_to_join = db.Column(db.String, default="Reason", nullable=False)
    submitted_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    # Foreign Keys
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    # Relationships Established
    user = db.relationship('User', back_populates='requests')
    organization = db.relationship('Organization', back_populates='requests')
    
    def __repr__(self):
        return f"<Request {self.id}, {self.reason_to_join}, {self.submitted_at}, {self.user_id}, {self.organization_id}>"