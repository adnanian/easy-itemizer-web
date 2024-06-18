from flask import request, session
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from resources.dry_resource import DRYResource
from config import db, api
from models.models import Item


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

    def post(self):
        """Creates a new instance of Item.

        Returns:
            dict: a JSONified dictionary of the created Item and its attributes, if creation successful, otherwise an error message.
        """
        try:
            new_item = Item(
                name=request.get_json().get("name"),
                description=request.get_json().get("description"),
                image_url=request.get_json().get("image_url"),
                part_number=request.get_json().get("part_number"),
                is_public=request.get_json().get("is_public"),
                user_id=request.get_json().get("user_id"),
            )
            db.session.add(new_item)
            db.session.commit()
            return new_item.to_dict(), 201
        except (ValueError, IntegrityError) as e:
            print(e)
            return {"message": str(e)}, 422


class ItemById(DRYResource):
    """Resource tied to the Item model. Handles fetch requests for single Item instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """

    def __init__(self):
        super().__init__(Item)


api.add_resource(ItemResource, "/items")
api.add_resource(ItemById, "/items/<int:id>", endpoint="item_by_id")
