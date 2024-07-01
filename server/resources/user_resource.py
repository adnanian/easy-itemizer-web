from flask import request, g, session
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
            # print(type(json), flush=True)
            password_related = {
                key: value
                for (key, value) in json.items()
                if "password" in key.lower()
            }
            non_password_related = {
                key: value
                for (key, value) in json.items()
                if "password" not in key.lower()
            }
            print(password_related, flush=True)
            print(non_password_related, flush=True)
        else:
            return {"message": "Incorrect password entered."}, 304
        
api.add_resource(CurrentUser, "/current_user")
# api.add_resource(UserById, "/users/<int:id>", endpoint="user_by_id")