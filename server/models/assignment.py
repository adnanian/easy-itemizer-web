from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates


class Assignment(db.Model, SerializerMixin):
    """
    Connects an organization and item together.
    An organization can have many items.
    An item can be used in many organizations.
    An assignment belongs to one organization and one item.
    Purpose of this model is to ensure that an item type locally used in an organization would
    have an accurately different quantity than that of another organization.
    """
    
    serialize_rules = (
        '-organization.assignments',
        '-organization.items',
        '-organization.memberships',
        '-organization.users',
        '-organization.requests',
        '-organization.organization_logs'
    )

    __tablename__ = "assignments"
    id = db.Column(db.Integer, primary_key=True)
    current_quantity = db.Column(
        db.Integer,
        db.CheckConstraint("count >= 0", name="check_count_constraint"),
        nullable=False,
    )
    enough_threshold = db.Column(
        db.Integer,
        db.CheckConstraint("count >= 1", name="check_threshold_constraint"),
        nullable=False,
    )
    added_at = db.Column(db.DateTime, server_default=db.func.now(), nullable=False)
    last_updated = db.Column(db.DateTime, onupdate=db.func.now())
    # Foreign Keys
    item_id = db.Column(db.Integer, db.ForeignKey("items.id"))
    organization_id = db.Column(db.Integer, db.ForeignKey("organizations.id"))
    # Relationships Established
    item = db.relationship("Item", back_populates="assignments")
    organization = db.relationship("Organization", back_populates="assignments")

    def __repr__(self):
        return f"<Assignment {self.id}, {self.current_quantity}, {self.enough_threshold}, {self.added_at}, {self.last_updated}, {self.item_id}, {self.organization_id}>"

    @validates("current_quantity")
    def validate_current_quantity(self, key, current_quantity):
        """Validates that the current_quantity attribute is a non-negative integer.

        Args:
            key (str): the attribute name. (Must be key)
            current_quantity (int): the current_quantity attribute value.

        Raises:
            ValueError: if current_quantity is a NOT a non-negative integer.

        Returns:
            int: the value of current_quantity.
        """
        if type(current_quantity) is not int or current_quantity < 0:
            raise ValueError(f"{key} - Item count must be a non-negative integer.")
        return current_quantity

    @validates("enough_threshold")
    def validate_enough_threshold(self, key, enough_threshold):
        """Validates that the enough_threshold attribute is a non-negative integer.

        Args:
            key (str): the attribute name. (Must be key)
            enough_threshold (int): the enough_threshold attribute value.

        Raises:
            ValueError: if enough_threshold is a NOT a positive integer.

        Returns:
            int: the value of enough_threshold.
        """
        if type(enough_threshold) is not int or enough_threshold < 1:
            raise ValueError(
                f"{key} - Minimum threshold for inventory to be considered enough must be a positive integer."
            )
        return enough_threshold
