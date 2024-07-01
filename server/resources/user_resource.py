from flask import request, g, session, make_response
from flask_restful import Resource
from config import db, api
from models.models import User

# class UserById(DRYResource):
#     """Resource tied to the User model. Handles fetch requests for single User instances.

#     Args:
#         RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
#     """
    
#     def __init__(self):
#         super().__init__(User)
        
#     def patch(self, id):
#         """Updates a user's information.
#         DO NOT CALL THIS METHOD UNTIL YOU RUN AUTHENTICATE FIRST!

#         Args:
#             id (int): the user id.

#         Returns:
#             dict: a JSONified dictionary of the created User and its attribute, if update successful, otherwise an error message.
#         """
#         try:
#             user = g.record
#             json = request.get_json()
#             for attr in json:
#                 value = json.get(attr)
#                 print(f"{attr} - {value}")
#                 if (attr == 'new_password'):
#                     if (value != ""):
#                         user.password_hash = value
#                         print("New password set.")
#                 else:
#                     if (getattr(user, attr) != value):
#                         setattr(user, attr, value)
#             db.session.add(user)
#             db.session.commit()
#             return user.to_dict(), 200
#         except ValueError as e:
#             print(e)
#             return {'error': 'Not Modified'}, 304

class CurrentUser(Resource):
    def patch(self):
        user = User.query.filter_by(id = session["user_id"]).first()
        json = request.get_json()
        if (user.authenticate(json.get("password"))):
            try:
                new_password = json.get("new_password")
                non_password_related = {
                    key: value
                    for (key, value) in json.items()
                    if "password" not in key.lower()
                }
                for attr in non_password_related:
                    value = non_password_related.get(attr)
                    if (getattr(user, attr) != value):
                        setattr(user, attr, value)
                if bool(new_password):
                    user.password_hash = new_password
                db.session.add(user)
                db.session.commit()
                return user.to_dict(), 200
            except Exception as e:
                return make_response({"message": str(e)}, 304)
        else:
            print("Nice try, hacker.", flush=True)
            return make_response({"message": "Incorrect password entered."}, 403)
        
    def delete(self):
        user = User.query.filter_by(id = session["user_id"]).first()
        if (user.authenticate(request.get_json().get("password"))):
            pass
        else:
            return make_response({"message": "Incorrect password entered."}, 403)
        
api.add_resource(CurrentUser, "/current_user")
# api.add_resource(UserById, "/users/<int:id>", endpoint="user_by_id")