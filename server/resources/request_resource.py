from flask import request
from flask_restful import Resource
from config import db, api
from resources.dry_resource import DRYResource
from models.models import Request, Membership
from helpers import RoleType

class AcceptRequest(Resource):
    
    def post(self):
        try:
            # Delete request from db, marking it accepted.
            request_to_accept = Request.query.filter_by(id = request.get_json().get("request_id")).first()
            user_id = request_to_accept.user_id
            org_id = request_to_accept.organization_id
            print(request_to_accept)
            db.session.delete(request_to_accept)
            db.session.commit()
            # Create a new membership
            print(f"User Id: {user_id}", flush=True)
            print(f"Org Id: {org_id}", flush=True)
            new_membership = Membership(
                user_id = user_id,
                organization_id = org_id,
                role = RoleType.REGULAR
            )
            db.session.add(new_membership)
            db.session.commit()
            # Process as log.
            return {"membership_l": new_membership.to_dict()}, 201
        except Exception as e:
            return {"message": str(e)}, 422
        
class RequestById(DRYResource):
    """Resource tied to the Request model. Handles fetch requests for single Request instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(Request)
        
api.add_resource(AcceptRequest, "/accept_request")
api.add_resource(RequestById, "/requests/<int:id>", endpoint="request_by_id")