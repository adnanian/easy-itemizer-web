from flask import request, session, g, render_template_string
from flask_restful import Resource
from config import db, api, send_email
from resources.dry_resource import DRYResource
from models.models import Organization, Membership, User
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
            return {"membership_l": new_membership.to_dict()}, 201
        except ValueError as e:
            print(e)
            return {"message": str(e)}, 422

class OrganizationById(DRYResource):
    """Resource tied to the Organization model. Handles fetch requests for single Organization instances.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(Organization, "organization_l")
        
class OrganizationInventoryReport(Resource):
    def post(self):
        org = Organization.query.filter_by(id = request.get_json().get("org_id")).first()
        if org:
            # UPDATE THE TWO LINES BELOW BEFORE FINAL DEPLOYMENT
            member_emails = [membership.user.email for membership in org.memberships]
            member_emails.append('adnan.wazwaz1445@easyitemizer.com')
            out_assignments = [
                {
                    "itemName": assignment.item.name,
                    "partNumber": assignment.item.part_number,
                    "currentQuantity": assignment.current_quantity,
                    "enoughThreshold": assignment.enough_threshold,
                    "addedAt": assignment.added_at,
                    "lastUpdated": assignment.last_updated
                }
                for assignment in org.assignments
                if assignment.current_quantity == 0
            ]
            low_assignments = [
                {
                    "itemName": assignment.item.name,
                    "partNumber": assignment.item.part_number,
                    "currentQuantity": assignment.current_quantity,
                    "enoughThreshold": assignment.enough_threshold,
                    "addedAt": assignment.added_at,
                    "lastUpdated": assignment.last_updated
                }
                for assignment in org.assignments
                if assignment.current_quantity > 0 and assignment.current_quantity < assignment.enough_threshold
            ]
            good_assignments = [
                {
                    "itemName": assignment.item.name,
                    "partNumber": assignment.item.part_number,
                    "currentQuantity": assignment.current_quantity,
                    "enoughThreshold": assignment.enough_threshold,
                    "addedAt": assignment.added_at,
                    "lastUpdated": assignment.last_updated
                }
                for assignment in org.assignments
                if assignment.current_quantity >= assignment.enough_threshold
            ]
            
            user = User.query.filter_by(id = session["user_id"]).first()
            with open("./html-templates/emails/inventory_report.html", "r") as file:
                template_content = file.read()
            html = render_template_string(
                template_content,
                org_name = org.name,
                sender = user.username,
                number_of_items = len(org.assignments),
                number_of_out = len(out_assignments),
                number_of_low = len(low_assignments),
                number_of_good = len(good_assignments),
                out_assignments = out_assignments,
                low_assignments = low_assignments,
                good_assignments = good_assignments
            )
            subject = f"\'{org.name}\' Inventory Status Report"
            send_email(subject, member_emails, html)
            return {"message": "Status report sent."}, 201
        else:
            return {"message": "404 Not Found"}, 404

api.add_resource(OrganizationCreator, "/organizations")
api.add_resource(OrganizationById, "/organizations/<int:id>", endpoint="organization_by_id")
api.add_resource(OrganizationInventoryReport, "/status_report")
