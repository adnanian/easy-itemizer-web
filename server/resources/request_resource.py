from flask import request, make_response, render_template_string, jsonify
from flask_restful import Resource
from config import db, api, home_page, route_prefix, invitation_token
from resources.dry_resource import DRYResource
from models.models import Request, Membership, User, Organization
from helpers import RoleType


class AcceptRequest(Resource):

    def post(self):
        try:
            # Delete request from db, marking it accepted.
            request_to_accept = Request.query.filter_by(
                id=request.get_json().get("request_id")
            ).first()
            user_id = request_to_accept.user_id
            org_id = request_to_accept.organization_id
            print(request_to_accept)
            db.session.delete(request_to_accept)
            db.session.commit()
            # Create a new membership
            print(f"User Id: {user_id}", flush=True)
            print(f"Org Id: {org_id}", flush=True)
            new_membership = Membership(
                user_id=user_id, organization_id=org_id, role=RoleType.REGULAR
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


class Invitation(Resource):
    def get(self, token):
        try:
            org_name = invitation_token(token)
            print(org_name, flush=True)
            with open("./html-templates/static-pages/request_form.html", "r") as file:
                page = file.read()
            html = render_template_string(
                page, org_name=org_name, route_prefix=route_prefix
            )
        except Exception as e:
            with open("./html-templates/static-pages/error.html", "r") as file:
                page = file.read()
            html = render_template_string(page, home_page=home_page)
        finally:
            response = make_response(html)
            response.headers["Content-Type"] = "text/html"
            return response


class RequestResource(Resource):
    def post(self):
        try:
            user = User.query.filter(
                User.email == request.get_json().get("email")
            ).first()
            if not user:
                raise ValueError("User with entered email does not exist.")
            org = Organization.query.filter(
                Organization.name == request.get_json().get("org_name")
            ).first()
            if not org:
                raise ValueError("Organization with title name does not exist.")
            new_request = Request(
                user_id=user.id,
                organization_id=org.id,
                reason_to_join=request.get_json().get("reason_to_join"),
            )
            db.session.add(new_request)
            db.session.commit()
            return {
                "request_l": new_request.to_dict(
                    only=(
                        "id",
                        "user_id",
                        "user.username",
                        "organization_id",
                        "reason_to_join",
                        "submitted_at",
                        "organization.name",
                    )
                )
            }, 201
        except Exception as e:
            return make_response({"message": str(e)}, 422)


api.add_resource(AcceptRequest, "/accept_request")
api.add_resource(RequestById, "/requests/<int:id>", endpoint="request_by_id")
api.add_resource(Invitation, "/invitation/<string:token>")
api.add_resource(RequestResource, "/requests")
