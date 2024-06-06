from sqlalchemy_serializer import SerializerMixin
from config import db

class OrganizationLog(db.Model, SerializerMixin):

    __tablename__ = 'organization_logs'
    id = db.Column(db.Integer, primary_key=True)
    contents = db.Column(db.String, nullable=False)
    occurrence = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    # Foreign Key
    organization_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    # Relationship Established
    organization = db.relationship('Organization', back_populates='organization_logs')
    
    def __repr__(self):
        return f"<OrganizationLog {self.id}, {self.contents}, {self.occurrence}>"