from flask import request, g
from flask_restful import Resource
from config import db, api
from resources.dry_resource import DRYResource
from models.organization import Organization

class OrganizationById(DRYResource):
    """Resource tied to the Organization model. Handles fetch requests for single Organization instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(Organization)
        
    def get(self, id):
        return super().get(id)
    
api.add_resource(OrganizationById, "/organizations/<int:id>", endpoint="organization_by_id")