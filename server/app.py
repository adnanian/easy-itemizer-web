#!/usr/bin/env python3

# Remote imports
from flask import (
    request,
    session,
    g,
    render_template,
    render_template_string,
    send_from_directory,
    url_for,
    flash,
)
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
import os
import datetime
import pytz

# Local imports
from models.models import *
from resources.resources import *
from config import app, db, api, generate_confirmation_token, confirm_token, send_email, scheduler

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
    endpoint_whitelist = ["signup", "login", "checksession", "confirm", "index", "static"]
    if not (session.get("user_id") or request.endpoint in endpoint_whitelist):
        print("Returning unauthorized message", flush=True)
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
    # print(request.endpoint)


class Signup(Resource):
    """Create a new user."""

    def post(self):
        """Creates a new instance of User.

        Returns:
            dict: a JSONified dictionary of the created User and its attributes, if creation successful, otherwise an error message.
        """
        # Retrieve form inputs
        print("Creating a new user. Standby...", flush=True)
        try:
            new_user = User(
                first_name=request.get_json().get("first_name"),
                last_name=request.get_json().get("last_name"),
                username=request.get_json().get("username"),
                email=request.get_json().get("email"),
            )
            print("Check 1 ", flush=True)
            new_user.password_hash = request.get_json().get("password")
            print("Check 2", flush=True)
            db.session.add(new_user)
            db.session.commit()
            print("User creation successful!", flush=True)
            # Send a confirmation token.
            token = generate_confirmation_token(new_user.email)
            confirm_url = url_for("confirm", token=token, _external=True)
            #print(os.getcwd(), flush=True)
            #breakpoint()
            path_to_template = "./email-templates/activate.html"
            with open(path_to_template, "r") as file:
                template_content = file.read()
            html = render_template_string(template_content, confirm_url=confirm_url)
            #html = html = render_template_string(open("activate.html").read(), confirm_url=confirm_url)
            subject = "Please Verify Your Email"
            print("About to send email", flush=True)
            send_email(subject, [new_user.email], html)
            return {"message": "A confirmation email has been sent via email."}, 201
        except (IntegrityError, ValueError) as e:
            print(e)
            print("BOO YOU STINK!")
            return {"message": str(e)}, 422


class Confirm(Resource):
    def get(self, token):
        try:
            email = confirm_token(token)
        except:
            flash("The confirmation link is invalid or has expired.", "danger")
        user = User.query.filter_by(email=email).first_or_404()
        if user.is_verified:
            flash("Account already confirmed. Please login.", "success")
        else:
            user.is_verified = True
            db.session.add(user)
            db.session.commit()
            flash("You have confirmed your account. Thanks!", "success")
        return {"message": "ACCOUNT CONFIRMED"}, 200


class Login(Resource):
    """Logs user into the account."""

    def post(self):
        """Sets the session's user_id, so that the user has authorization to access appropriate data.

        Returns:
            JSON: the JSONified user object, if entered password is correct; an "Unauthorized" message otherwise.
        """
        login_name = request.get_json().get("username_or_email")
        print(login_name, flush=True)
        try:
            if login_name:
                user = (
                    User.query.filter_by(username=login_name).first()
                    or User.query.filter_by(email=login_name).first()
                )
                if user and user.authenticate(request.get_json().get("password")):
                    print(user, flush=True)
                    session["user_id"] = user.id
                    return user.to_dict(), 200
        except Exception as e:
            print(f"{str(e)}")
            return {"message": "401 Unauthorized"}, 401


class Logout(Resource):
    """Logs user out of the webiste."""

    def delete(self):
        """_summary_

        Returns:
            _type_: _description_
        """
        # print("About to log out.")
        session["user_id"] = None
        # print("Logging out")
        return {}, 204


class CheckSession(Resource):
    """Check if user is logged in."""

    def get(self):
        """
        Checks if there is a user id for the session object.
        In other words, checks if a user is logged in.

        Returns:
          type (dict): the JSONified user object, if there's an id for the session object, the message "Unauthorized" otherwise.
        """
        if user := User.query.filter_by(id=session.get("user_id")).first():
            return user.to_dict(), 200
        print("SUPERDUPERDAB", flush=True)
        return {"message": "401 Unauthorized"}, 401


class Index(Resource):
    def get(self):
        print(f"The CWD at index call is: {os.getcwd()}", flush=True)
        return send_from_directory("../client/dist", "index.html")


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
        cutoff = datetime.datetime.now(pytz.utc) - datetime.timedelta(days = LOG_DURATION_LIMIT)
        OrganizationLog.query.filter(OrganizationLog.occurrence <= cutoff).delete()
        db.session.commit()
        print("Old logs have been cleared.", flush=True)


api.add_resource(Index, "/")
api.add_resource(Signup, "/signup")
api.add_resource(Confirm, "/confirm/<string:token>")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(CheckSession, "/check_session")

scheduler.add_job(delete_old_logs, "interval", seconds=SCHEDULER_INTERVAL)
scheduler.start()

# With /api
# api.add_resource(Signup, "/api/signup")
# api.add_resource(Confirm, "/api/confirm/<string:token>")
# api.add_resource(Login, "/api/login")
# api.add_resource(Logout, "/api/logout")
# api.add_resource(CheckSession, "/api/check_session")
# api.add_resource(UserById, "/api/users/<int:id>")

# With /api + endpoint
# api.add_resource(Signup, "/signup")
# api.add_resource(Confirm, "/confirm/<string:token>")
# api.add_resource(Login, "/login")
# api.add_resource(Logout, "/logout")
# api.add_resource(CheckSession, "/check_session")
# api.add_resource(UserById, "/users/<int:id>")

# @app.route('/')
# def index():
#     return '<h1>Phase 5 Project ... In Progress</h1>'

# Views go here! use either route!
# @app.errorhandler(404)
# def not_found(e):
#     return render_template("index.html")


# @app.route("/", defaults={"path": ""})
# @app.route("/<path:path>")
# def catch_all(path):
#     return render_template("index.html")


if __name__ == "__main__":
    app.run(port=5000, debug=True)
