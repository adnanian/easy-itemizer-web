from flask import request, session, g
from flask_restful import Resource
from config import db, api
from resources.dry_resource import DRYResource
from models.models import Organization, Membership, OrganizationLog
from helpers import RoleType

class OrganizationCreator(Resource):
    def post(self):
        """
        Creates a new instance of Organization.
        Then creates an owner membership tied to that organization.

        Returns:
            dict: a JSONified dictionary of the created Membership and its attributes, if creation successful, otherwise an error message.
        """
        try:
            # Create organization
            new_org = Organization(
                name = request.get_json().get("name"),
                description = request.get_json().get("description"),
                image_url = request.get_json().get("image_url"),
                banner_url = request.get_json().get("banner_url")
            )
            db.session.add(new_org)
            db.session.commit()
            # Create membership as owner
            new_membership = Membership(
                role = RoleType.OWNER,
                user_id = session["user_id"],
                organization_id = new_org.id
            )
            db.session.add(new_membership)
            db.session.commit()
            # Create log
            log = OrganizationLog(
                contents=[
                    f"{new_membership.user.username} created a new organization: '{new_org.name}'!"
                ],
                organization_id=new_org.id,
            )
            db.session.add(log)
            db.session.commit()
            
            return new_membership.to_dict(), 201
        except ValueError as e:
            print(e)
            return {"message": str(e)}, 422

class OrganizationById(DRYResource):
    """Resource tied to the Organization model. Handles fetch requests for single Organization instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(Organization)
        
    def get(self, id):
        return super().get(id)

api.add_resource(OrganizationCreator, "/organizations")
api.add_resource(OrganizationById, "/organizations/<int:id>", endpoint="organization_by_id")
