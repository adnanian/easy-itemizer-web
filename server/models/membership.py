from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy.orm import validates
from helpers import is_non_empty_string, get_model_invoker, RoleType

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
    
    serialize_rules = (
        '-user.memberships',
        '-user.organizations',
        '-user.items',
        '-user.requests',
        '-organization.memberships',
        '-organization.users',
        '-organization.assignments',
        '-organization.items',
        '-organization.requests'
        '-organization.organization_logs'
    )
    
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
    
    @validates('role')
    def validate_role(self, key, role):
        """Validates that a valid role name was entered.

        Args:
            key (str): the attribute name.
            role (str): the role attribute value.

        Raises:
            ValueError: if there is already a membership with the given user_id and orgnization_id under membership.
            ValueError: if an invalid role name from the list of roles was entered.
            ValueError: if a user attempts to assign ownership to an organization when there already is one.
            ValueError: if a user is already a member of an organization.

        Returns:
            str: the value of role.
        """
        if Membership.query.filter(Membership.user_id == self.user_id, Membership.organization_id == self.organization_id).first():
            #print(stack_trace())
            print(get_model_invoker())
            if (get_model_invoker() != 'patch'):
                raise ValueError(f"User {self.user_id} already belongs to organization {self.organization_id}.")
        # if not is_non_empty_string(role):
        #      raise ValueError(f"{key.title()} must be a non-empty string.")
        role = role.upper()
        #print(role, self.organization_id)
        if not RoleType.is_valid_role_name(role):
            raise ValueError(f"{key.title()} must be one of the following values: {RoleType.get_all()}")
        if role == RoleType.OWNER and Membership.query.filter(Membership.organization_id==self.organization_id, Membership.role==RoleType.OWNER).first():
            raise ValueError(f"Only one member of an organization can be the owner.")
        print(Membership.query.filter(Membership.organization_id==self.organization_id).first())
        if (not Membership.query.filter(Membership.organization_id==self.organization_id).first()) and (role != RoleType.OWNER):
            raise ValueError(f"{key.title()} must be owner for the first member.")
        return role