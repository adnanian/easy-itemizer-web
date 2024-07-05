#!/usr/bin/env python3

# Remote imports
from flask import (
    request,
    session,
    g,
    render_template,
    render_template_string,
    send_from_directory,
    make_response,
)
from flask_restful import Resource
import datetime
import pytz

# Local imports
from models.models import *
from resources.resources import *
from config import (
    app,
    db,
    api,
    scheduler,
    send_email
)
from model_log_mapping import ModelLogMap

LOG_DURATION_LIMIT = 7
""" The maximum number of days that a log remains in the organization.
    This should be more than enough time for admins to read through all
    their logs.
"""

SCHEDULER_INTERVAL = 86400
""" The standard interval, in seconds, to execute a background job. """


@app.before_request
def check_if_logged_in():
    """This view will be run to check if there's a logged in user before attempting to access other data.

    Returns:
        JSON: if a user is not logged in, then an "Unauthorized" message will be returned.
    """
    # breakpoint()
    print(f"Current endpoint: {request.endpoint}", flush=True)
    endpoint_whitelist = [
        "signup",
        "login",
        "checksession",
        "confirm",
        "index",
        "static",
        "get",
        "contact",
        "invitation",
        "requestresource",
        "forgotpassword",
        "password_reset_form",
        "password_reset"
    ]
    if not (session.get("user_id") or request.endpoint in endpoint_whitelist):
        # print("Returning unauthorized message", flush=True)
        return {"error": "Unauthorized! You must be logged in ree"}, 401


@app.before_request
def get_record_by_id():
    """If accessing a model record, this view will run to get the model by id. The correct model will be matched by
      the endpoint.

    Returns:
        any: if the model record does not exist, then a "not found" message will be returned; otherwise, returns nothing.
    """
    endpoint_model_map = {
        "user_by_id": User,
        "item_by_id": Item,
        "organization_by_id": Organization,
        "membership_by_id": Membership,
        "assignment_by_id": Assignment,
        "request_by_id": Request,
    }
    if model := endpoint_model_map.get(request.endpoint):
        id = request.view_args.get("id")
        if record := model.query.filter_by(id=id).first():
            g.record = record
        else:
            return {
                "error": f"{model.__name__} record of id, {id}, does not exist. Please try again later."
            }, 404
    # # print(request.endpoint)


@app.after_request
def create_log(response):
    """_summary_

    Article of Reference: https://stackoverflow.com/questions/2612610/how-to-access-get-or-set-object-attribute-given-string-corresponding-to-name-o

    Args:
        response (_type_): _description_

    Returns:
        _type_: _description_
    """
    endpoint_blacklist = [
        "signup",
        "login",
        "logout",
        "checksession",
        "confirm",
        "index",
        "static",
        "get",
        "currentuser",
        "contact",
        "forgotpassword",
        "password_reset_form",
        "password_reset"
    ]
    response_loggable = request.method != "GET"
    status_ok = 200 <= response.status_code < 300
    is_dict = type(body := response.get_json()) is dict
    # print(f"AFTER REQUEST ENDPOINT: {request.endpoint}", flush=True)
    if (
        (request.endpoint not in endpoint_blacklist)
        and response_loggable
        and status_ok
        and is_dict
    ):
        # print(f"JSON: {body}", flush=True)
        key = list(body.keys())[0]
        model_log_mapping = ModelLogMap.mappings.get(key)
        if model_log_mapping:
            # print(f"Key: {key}", flush=True)
            # print(f"Map: {model_log_mapping}", flush=True)
            # print(f"Real Response: {body[key]}", flush=True)
            user = User.query.filter_by(id=session.get("user_id")).first()
            # Get appropriate CRUD method
            map_method = getattr(model_log_mapping, request.method.lower())
            # Get org_id
            if key in ["item_l", "assignment_l"] and request.method == "POST":
                org_id = body[key]["assignment"]["organization_id"]
            elif key == "organization_l":
                org_id = body[key]["id"]
            else:
                org_id = body[key]["organization_id"]
            # Create new log.
            log = OrganizationLog(
                contents=map_method(body[key], user), organization_id=org_id
            )
            db.session.add(log)
            db.session.commit()
            # Modify response and return.
            return make_response(body[key], response.status_code)
    return response


class Index(Resource):

    def get(self, orgId=None):
        # print(f"The CWD at index call is: {os.getcwd()}", flush=True)
        return send_from_directory("../client/dist", "index.html")
    
class Contact(Resource):
    def post(self):
        try:
            with open("./html-templates/emails/inquiry.html", "r") as file:
                template_content = file.read()
            html = render_template_string(
                template_content,
                first_name = request.get_json().get("firstName"),
                last_name = request.get_json().get("lastName"),
                email = request.get_json().get("email"),
                message = request.get_json().get("inquiry")
            )
            subject = "You Have a New Inquiry"
            send_email(subject, ["support@easyitemizer.com"], html)
            return {}, 204
        except Exception as e:
            return {"error": "Unprocessable entry"}, 422


def delete_old_logs():
    """
    TODO

    Articles of Reference:
    https://www.geeksforgeeks.org/how-to-make-a-timezone-aware-datetime-object-in-python/
    https://stackoverflow.com/questions/21214270/how-to-schedule-a-function-to-run-every-hour-on-flask
    https://apscheduler.readthedocs.io/en/3.x/userguide.html
    https://stackoverflow.com/questions/63693872/flask-how-can-i-delete-data-ranging-back-x-days
    """
    with app.app_context():
        cutoff = datetime.datetime.now(pytz.utc) - datetime.timedelta(
            days=LOG_DURATION_LIMIT
        )
        OrganizationLog.query.filter(OrganizationLog.occurrence <= cutoff).delete()
        db.session.commit()
        # print("Old logs have been cleared.", flush=True)


api.add_resource(
    Index,
    "/",
    "/about",
    "/settings",
    "/my-organizations",
    "/my-organizations/<string:orgId>",
    "/login",
    "/signup",
    "/forgot-password",
    "/unauthorized",
    endpoint="index"
)
api.add_resource(Contact, "/contact")

scheduler.add_job(delete_old_logs, "interval", seconds=SCHEDULER_INTERVAL)
scheduler.start()


# Views go here! use either route!
@app.errorhandler(404)
def not_found(e):
    return render_template("index.html")


# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>")
# def catch_all(path):
#     return render_template("index.html"), 404


if __name__ == "__main__":
    app.run(port=5000, debug=True)
