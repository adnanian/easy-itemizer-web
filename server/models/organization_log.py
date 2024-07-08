from sqlalchemy_serializer import SerializerMixin
from config import db


class OrganizationLog(db.Model, SerializerMixin):
    """
    Summarized event of everything that occurs within an organization.
    Useful for admins and owners to monitor all activity that occurs
    within the organization. This can help identify anybody who is
    violating rules.

    An organization can have many logs.
    A log belongs to one organization.
    """

    __tablename__ = "organization_logs"
    id = db.Column(db.Integer, primary_key=True)
    contents = db.Column(db.ARRAY(db.String))
    occurrence = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    # Foreign Key
    organization_id = db.Column(
        db.Integer, db.ForeignKey("organizations.id"), nullable=False
    )
    # Relationship Established
    organization = db.relationship("Organization", back_populates="organization_logs")

    def __repr__(self):
        return f"<OrganizationLog {self.id}, {self.contents}, {self.occurrence}>"
