from flask import request, session, g, make_response, send_from_directory
from flask_restful import Resource
from config import db, api
from resources.dry_resource import DRYResource
from models.models import Membership, OrganizationLog
from helpers import RoleType


class MembershipById(DRYResource):
    """Resource tied to the Membership model. Handles fetch requests for single Membership instances.
    When a membership is updated or deleted, a log will be entered for the organization tied to that membership.

    Args:
        DRYResource (DRYResource): simplify RESTFul API building.
    """

    def __init__(self):
        super().__init__(Membership, "membership_l")


class TransferOwnership(Resource):
    """Resource tied to the Membership model. Deletes the current user's
    membership from the current organization and updates another member's
    role to OWNER. Once this is done, a log will be entered for the organization
    tied to the membership.

    Args:
        Resource (Resource): the RESTful Resource container.
    """

    def patch(self, org_id):
        """
        Removes the current member from the organization and assigns
        the OWNER value to the role of another member.

        Args:
            org_id (int): the organization id.

        Returns:
            Response: the appropriate response depending on the success of the transfer.
        """
        try:
            # Delete leaving user's membership
            leaving_member = Membership.query.filter(
                Membership.organization_id == org_id,
                Membership.user_id == session["user_id"],
            ).first()
            leaving_username = leaving_member.user.username
            db.session.delete(leaving_member)
            db.session.commit()
            # Update admin's membership role to owner
            new_owner = Membership.query.filter_by(
                id=request.get_json().get("admin_id")
            ).first()
            new_owner.role = RoleType.OWNER
            db.session.add(new_owner)
            db.session.commit()
            log = OrganizationLog(
                contents=[
                    f'Owner, "{leaving_username}", has transferred ownership of this organization to admin, "{new_owner.user.username}", and left.'
                ],
                organization_id=org_id,
            )
            db.session.add(log)
            db.session.commit()
            return {}, 204
        except Exception as e:
            return make_response({"message": str(e)}, 403)


api.add_resource(MembershipById, "/memberships/<int:id>", endpoint="membership_by_id")
api.add_resource(
    TransferOwnership, "/transfer_ownership/<int:org_id>", endpoint="leave_and_transfer"
)
