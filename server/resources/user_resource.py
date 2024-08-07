from flask import (
    request,
    session,
    make_response,
    render_template_string,
    url_for,
    redirect,
)
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from config import (
    db,
    api,
    generate_confirmation_token,
    send_email,
    confirm_token,
    generate_password_reset_link,
    password_reset_token,
    home_page,
    route_prefix,
)
from models.models import User
from helpers import random_alphanumeric_sequence


class Signup(Resource):
    """Create a new user."""

    def post(self):
        """Creates a new instance of User.

        Returns:
            dict: a JSONified dictionary of the created User and its attributes, if creation successful, otherwise an error message.
        """
        # Retrieve form inputs
        # print("Creating a new user. Standby...", flush=True)
        try:
            new_user = User(
                first_name=request.get_json().get("first_name"),
                last_name=request.get_json().get("last_name"),
                username=request.get_json().get("username"),
                email=request.get_json().get("email"),
            )
            # print("Check 1 ", flush=True)
            new_user.password_hash = request.get_json().get("password")
            # print("Check 2", flush=True)
            db.session.add(new_user)
            db.session.commit()
            # print("User creation successful!", flush=True)
            # Send a confirmation token.
            token = generate_confirmation_token(new_user.email)
            confirm_url = url_for("confirm", token=token, _external=True)
            ## print(os.getcwd(), flush=True)
            # breakpoint()
            path_to_template = "./html-templates/emails/activate.html"
            with open(path_to_template, "r") as file:
                template_content = file.read()
            html = render_template_string(template_content, confirm_url=confirm_url)
            # html = html = render_template_string(open("activate.html").read(), confirm_url=confirm_url)
            subject = "Please Verify Your Email"
            # print("About to send email", flush=True)
            send_email(subject, [new_user.email], html)
            return {"message": "A confirmation email has been sent via email."}, 201
        except (IntegrityError, ValueError) as e:
            # print(e)
            # print("BOO YOU STINK!")
            return {"message": str(e)}, 422


class Login(Resource):
    """Logs user into the account."""

    def post(self):
        """Sets the session's user_id, so that the user has authorization to access appropriate data.

        Returns:
            JSON: the JSONified user object, if entered password is correct; an "Unauthorized" message otherwise.
        """
        login_name = request.get_json().get("username_or_email")
        # print(login_name, flush=True)
        try:
            if login_name:
                # user = (
                #     User.query.filter_by(username=login_name).first()
                #     or User.query.filter_by(email=login_name).first()
                # )
                user = User.query.filter(
                    (User.username == login_name) | (User.email == login_name)
                ).first()
                if user and user.authenticate(request.get_json().get("password")):
                    # print(user, flush=True)
                    if not user.is_verified:
                        raise AttributeError("Account needs to be verified first.")
                    if user.is_banned:
                        raise AttributeError(
                            "Account with associated username/email is banned."
                        )
                    session["user_id"] = user.id
                    return user.to_dict(), 200
            raise ValueError(
                "Account with entered credentials does not exist. Please try again!"
            )
        except Exception as e:
            # print(f"{str(e)}")
            return make_response({"message": str(e)}, 401)


class Logout(Resource):
    """Logs user out of the webiste."""

    def delete(self):
        """Sets the session's user_id key to None.

        Returns:
            Response: a response with no content.
        """
        # # print("About to log out.")
        session["user_id"] = None
        # # print("Logging out")
        return {}, 204


class Confirm(Resource):
    """Resource tied to the User model. Used for activation users' accounts.

    Args:
        Resource (Resource): the RESTful Resource container.
    """

    def get(self, token):
        """Generates a page using the token generated from the link that was sent to the
        newly created user, showing his/her account's current verification status.

        Args:
            token (str): the email token.

        Returns:
            Response: the page with the appropriate message.
        """
        try:
            email = confirm_token(token)
        except:
            title = "Activation Error"
            message = "The confirmation link is invalid or has expired."
        user = User.query.filter_by(email=email).first_or_404()
        if user.is_verified:
            title = "Account Already Verified"
            message = (
                "You already verified your account. Please close this page and login."
            )
        else:
            user.is_verified = True
            db.session.add(user)
            db.session.commit()
            title = "Account Verification Complete"
            message = "Your account hass been successfully verified. You may now close this page and log in."
        with open(
            "./html-templates/static-pages/activation_complete.html", "r"
        ) as file:
            template_content = file.read()
        html = render_template_string(
            template_content, page_title=title, page_message=message
        )
        response = make_response(html)
        response.headers["Content-Type"] = "text/html"
        return response


class ForgotPassword(Resource):
    """Resource tied to the User model. Used for sending links to reset passwords.

    Args:
        Resource (Resource): the RESTful Resource template.
    """

    def post(self):
        """Generates a custom link for the user to send an email to, so that he/she
        can reset his/her password. Then sends the email.

        Raises:
            ValueError: if the email does not exist in the database.

        Returns:
            Response: the appropriate response depending on the success of the operation.
        """
        try:
            user = User.query.filter(
                User.email == request.get_json().get("email")
            ).first()
            if not user:
                raise ValueError(
                    "An account with the entered email does not exist. Please try again."
                )
            with open("./html-templates/emails/reset_password_link.html", "r") as file:
                template_content = file.read()
            salted_email = user.email + "|" + random_alphanumeric_sequence()
            token = generate_password_reset_link(salted_email)
            reset_url = url_for("password_reset_form", token=token, _external=True)
            html = render_template_string(
                template_content, reset_password_url=reset_url
            )
            subject = "Your Link to Reset Your Easy Itemizer Password"
            send_email(subject, [user.email], html)
            return {}, 204
        except Exception as e:
            return make_response({"message": str(e)}, 404)


class ResetPasswordForm(Resource):
    """
    Displays the reset password form.
    """

    def get(self, token):
        """Validates the token that was sent to the user. Then, renders
        a form for the user to reset his/her password.

        Args:
            token (str): the token from the link sent to the user.

        Raises:
            ValueError: if the token is not valid.

        Returns:
            Response: the reset password form if the token is valid, the error page other wise.
        """
        try:
            salted_email = password_reset_token(token)
            email = salted_email[0 : salted_email.index("|")]
            user = User.query.filter(User.email == email).first()
            if not user:
                raise ValueError("User with email not found.")
            with open(
                "./html-templates/static-pages/reset_password_form.html", "r"
            ) as file:
                page = file.read()
            html = render_template_string(
                page, route_prefix=route_prefix, email=user.email
            )
        except Exception as e:
            print(e, flush=True)
            with open("./html-templates/static-pages/error.html", "r") as file:
                page = file.read()
            html = render_template_string(page, home_page=home_page)
        finally:
            response = make_response(html)
            response.headers["Content-Type"] = "text/html"
            return response


class ResetPassword(Resource):
    """Resource tied to the User model. Used for changing passwords.

    Args:
        Resource (Resource): the RESTful Resource container.
    """

    def patch(self, email):
        """Updates the user's password.

        Args:
            email (str): the user's email.

        Raises:
            ValueError: if the email is not in the database.

        Returns:
            Response: the appropriate response depending on the success of the operation.
        """
        try:
            if not (user := User.query.filter(User.email == email).first()):
                raise ValueError(
                    "The account with the associated email does not exist."
                )
            user.password_hash = request.get_json().get("new_password")
            db.session.add(user)
            db.session.commit()
            return make_response({}, 204)
        except Exception as e:
            return make_response({"message": str(e)}, 403)


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
            if user.is_banned:
                return redirect("/")
            return user.to_dict(), 200
        # print("SUPERDUPERDAB", flush=True)
        return {"message": "401 Unauthorized"}, 401


class CurrentUser(Resource):
    """Resource tied to the User model. Handles fetch request for single users.
    Note that in this case, since the session stores the logged in user's id,
    the user's id is retrieved from the session, instead of having to pass the
    id in the route.

    Args:
        Resource (Resource): the RESTful Resource container.
    """

    def patch(self):
        """Updates the current user's information.
        Note: The user must enter his/her current password in order for this to be successful.

        Returns:
            Response: the user's updated data, if update successful, an error message otherwise.
        """
        user = User.query.filter_by(id=session["user_id"]).first()
        json = request.get_json()
        if user.authenticate(json.get("password")):
            try:
                new_password = json.get("new_password")
                non_password_related = {
                    key: value
                    for (key, value) in json.items()
                    if "password" not in key.lower()
                }
                for attr in non_password_related:
                    value = non_password_related.get(attr)
                    if getattr(user, attr) != value:
                        setattr(user, attr, value)
                if bool(new_password):
                    user.password_hash = new_password
                db.session.add(user)
                db.session.commit()
                return user.to_dict(), 200
            except Exception as e:
                return make_response({"message": str(e)}, 304)
        else:
            # print("Nice try, hacker.", flush=True)
            return make_response({"message": "Incorrect password entered."}, 403)

    def delete(self):
        """Deletes the current user from the server.
        Note: The user must enter his/her current password in order for this to be successful.

        Returns:
            Response: a response with no content if the operation was successful, an error message otherwise.
        """
        user = User.query.filter_by(id=session["user_id"]).first()
        if user.authenticate(request.get_json().get("password")):
            db.session.delete(user)
            db.session.commit()
            return make_response({"message": "Account deleted"}, 204)
        else:
            return make_response({"message": "Incorrect password entered."}, 403)


api.add_resource(Signup, "/signup")
api.add_resource(Login, "/login")
api.add_resource(Logout, "/logout")
api.add_resource(Confirm, "/confirm/<string:token>")
api.add_resource(ForgotPassword, "/forgot_password")
api.add_resource(
    ResetPasswordForm,
    "/reset_password_form/<string:token>",
    endpoint="password_reset_form",
)
api.add_resource(
    ResetPassword, "/reset_password/<string:email>", endpoint="password_reset"
)
api.add_resource(CheckSession, "/check_session")
api.add_resource(CurrentUser, "/current_user")
