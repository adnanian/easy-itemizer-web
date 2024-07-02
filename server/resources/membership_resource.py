from flask import request, g
from flask_restful import Resource
from config import db, api
from resources.dry_resource import DRYResource
from models.membership import Membership

class MembershipById(DRYResource):
    """Resource tied to the Membership model. Handles fetch requests for single Membership instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """

    def __init__(self):
        super().__init__(Membership, "membership_l")
        
api.add_resource(MembershipById, "/memberships/<int:id>", endpoint="membership_by_id")