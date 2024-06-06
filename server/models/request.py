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
    
    @validates('organization_id')
    def validate_request(self, key, organization_id):
        """Validates that there is not an existing request with the declared user_id
        and organization_id, or that the user is not already part of that organization.

        Args:
            key (str): the attribute name
            organization_id (str): the attribute value.

        Raises:
            ValueError: if a request for user_id and organization_id is not already active.
            ValueError: if a user is alreaddy part of that organization.

        Returns:
            _type_: _description_
        """
        if Request.query.filter(Request.user_id == self.user_id, Request.organization_id == organization_id).first():
            raise ValueError(f"User of ID {self.user_id} is already in the request queue for organization ID {organization_id}")
        
        from models.membership import Membership
        if Membership.query.filter(Membership.user_id == self.user_id, Membership.organization_id == organization_id).first():
            raise ValueError(f"User ID {self.user_id} already belongs to organization ID {organization_id}")
        return organization_id