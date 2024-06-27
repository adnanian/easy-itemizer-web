from flask import request, g
from flask_restful import Resource
from config import db, api
from resources.dry_resource import DRYResource
from models.assignment import Assignment

class AssignmentResource(Resource):
     def post(self):
        """Creates a new instance of Assignment.

        Returns:
            dict: a JSONified dictionary of the created assignment and its attributes, if creation successful, otherwise an error message.
        """
        try:
            new_assignment = Assignment(
                item_id=request.get_json().get("item_id"),
                organization_id=request.get_json().get("organization_id"),
                current_quantity=request.get_json().get("current_quantity"),
                enough_threshold=request.get_json().get("enough_threshold")
            )
            db.session.add(new_assignment)
            db.session.commit()
            return {
                "assignment_l": {
                    "assignment": new_assignment.to_dict()
                }
            }, 201
        except ValueError as e:
            print(e)
            return {"message": "422 Unprocessable Entity"}, 422


class AssignmentById(DRYResource):
    """Resource tied to the Assignment model. Handles fetch requests for single Assignment instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(Assignment, "assignment_l")
        
api.add_resource(AssignmentResource, "/assignments")
api.add_resource(AssignmentById, "/assignments/<int:id>", endpoint="assignment_by_id")