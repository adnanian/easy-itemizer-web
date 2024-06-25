from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from resources.dry_resource import DRYResource
from config import db, api
from models.models import Item, Assignment


class ItemResource(Resource):
    """Resource tied to the Item model. Handles fetch requests for all Item instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """

    def get(self):
        """_summary_"""
        items = [
            item.to_dict(only=('id', 'name', 'part_number', 'image_url', 'user_id'))
            for item in Item.query.filter(
                db.or_(Item.is_public == True, Item.user_id == session.get("user_id"))
            )
        ]
        return items, 200

class AddItemAndAssignment(Resource):
    def post(self):
        """Creates a new instance of Item and an Assignment with that Item.
        
        Returns:
    #         dict: a JSONified dictionary of the created Item and its attributes, if creation successful, otherwise an error message.
        """
        try:
            new_item = Item(
                name=request.get_json().get("name"),
                description=request.get_json().get("description"),
                image_url=request.get_json().get("image_url"),
                part_number=request.get_json().get("part_number"),
                is_public=request.get_json().get("is_public"),
                user_id=session["user_id"]
            )
            db.session.add(new_item)
            db.session.commit()
            new_assignment = Assignment(
                item_id=new_item.id,
                organization_id=request.get_json().get("organization_id"),
                current_quantity=request.get_json().get("current_quantity"),
                enough_threshold=request.get_json().get("enough_threshold")
            )
            db.session.add(new_assignment)
            db.session.commit()
            return {"item": new_item.to_dict(), "assignment": new_assignment.to_dict()}, 201
        except Exception as e:
            print(e, flush=True)
            return {"message": str(e)}, 422

class ItemById(DRYResource):
    """Resource tied to the Item model. Handles fetch requests for single Item instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """

    def __init__(self):
        super().__init__(Item)
        
class ReportItem(Resource):
    def post(self):
        pass
        item_in_question = Item.query.filter_by(id=id).first()
        if (item_in_question):
            pass
        else:
            return {"message": "404 Not Found"}, 404


api.add_resource(ItemResource, "/items", endpoint="items")
api.add_resource(AddItemAndAssignment, "/add_new_item")
api.add_resource(ItemById, "/items/<int:id>", endpoint="item_by_id")
