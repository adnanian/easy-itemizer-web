from flask import request, session, render_template_string, g
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from resources.dry_resource import DRYResource
from config import db, api, send_email
from models.models import Item, Assignment, User, OrganizationLog


class ItemResource(Resource):
    """Resource tied to the Item model. Handles fetch requests for all Item instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """

    def get(self):
        """_summary_"""
        items = [
            item.to_dict(only=("id", "name", "part_number", "image_url", "user_id"))
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
            # Create item.
            new_item = Item(
                name=request.get_json().get("name"),
                description=request.get_json().get("description"),
                image_url=request.get_json().get("image_url"),
                part_number=request.get_json().get("part_number"),
                is_public=request.get_json().get("is_public"),
                user_id=session["user_id"],
            )
            db.session.add(new_item)
            db.session.commit()
            # Create assignment to item.
            new_assignment = Assignment(
                item_id=new_item.id,
                organization_id=request.get_json().get("organization_id"),
                current_quantity=request.get_json().get("current_quantity"),
                enough_threshold=request.get_json().get("enough_threshold"),
            )
            db.session.add(new_assignment)
            db.session.commit()
            return {
                "item_l": {
                    "item": new_item.to_dict(),
                    "assignment": new_assignment.to_dict(),
                }
            }, 201
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

    def delete(self, id):
        record = g.record
        assignments = [
            {
                "item_name": assignment.item.name,
                "item_part_number": assignment.item.part_number,
                "current_quantity": assignment.current_quantity,
                "enough_threshold": assignment.enough_threshold,
                "organization_id": assignment.organization_id
            }
            for assignment in Assignment.query.filter_by(item_id=record.id).all()
        ]
        db.session.delete(record)
        db.session.commit()
        logs = []
        for assignment in assignments:
            # print(assignment.id, flush=True)
            log = OrganizationLog(
                contents=[
                    f"The owner of an item this organization uses has removed it from the system",
                    f"Name: {assignment['item_name']}",
                    f"Part Number: {assignment['item_part_number']}",
                    f"Current Quantity: {assignment['current_quantity']}",
                    f"Enough Threshold: {assignment['enough_threshold']}",
                ],
                organization_id=assignment["organization_id"]
            )
            logs.append(log)
        if len(logs):
            db.session.add_all(logs)
            db.session.commit()
        return {"message": f"{self.model.__name__} successfully deleted."}, 204


class ReportItem(Resource):
    def post(self):
        pass
        item_in_question = Item.query.filter_by(
            id=request.get_json().get("item_id")
        ).first()
        if item_in_question:
            user = User.query.filter_by(id=session["user_id"]).first()
            with open("./html-templates/emails/report.html", "r") as file:
                template_content = file.read()
            html = render_template_string(
                template_content,
                first_name=user.first_name,
                last_name=user.last_name,
                username=user.username,
                email=user.email,
                item_name=item_in_question.name,
                description=item_in_question.description,
                part_number=item_in_question.part_number,
                visibility="Public" if item_in_question.is_public else "Private",
                item_adder=item_in_question.user.username,
                item_image=item_in_question.image_url,
                report_reason=request.get_json().get("submission_text"),
            )
            subject = (
                f"Item {item_in_question.id} Reported as Suspicious; Please Review"
            )
            send_email(subject, ["support@easyitemizer.com"], html)
            return {"message": "Item reported!"}, 201
        else:
            return {"message": "404 Not Found"}, 404


api.add_resource(ItemResource, "/items", endpoint="items")
api.add_resource(AddItemAndAssignment, "/add_new_item")
api.add_resource(ItemById, "/items/<int:id>", endpoint="item_by_id")
api.add_resource(ReportItem, "/report_item")
