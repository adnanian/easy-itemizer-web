from flask import request, g
from flask_restful import Resource
from config import db, api
from resources.dry_resource import DRYResource
from models.assignment import Assignment

class AssignmentById(DRYResource):
    """Resource tied to the Assignment model. Handles fetch requests for single Assignment instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(Assignment)
        
api.add_resource(AssignmentById, "/assignments/<int:id>", endpoint="assignment_by_id")