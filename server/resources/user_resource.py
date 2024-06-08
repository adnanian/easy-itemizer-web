from flask import request, g
from resources.dry_resource import DRYResource
from config import db
from models.models import User

class UserById(DRYResource):
    """Resource tied to the User model. Handles fetch requests for single User instances.

    Args:
        RestResourceTemplate (RestResourceTemplate): simplify RESTFul API building.
    """
    
    def __init__(self):
        super().__init__(User)
        
    def patch(self, id):
        """Updates a user's information.
        DO NOT CALL THIS METHOD UNTIL YOU RUN AUTHENTICATE FIRST!

        Args:
            id (int): the user id.

        Returns:
            dict: a JSONified dictionary of the created User and its attribute, if update successful, otherwise an error message.
        """
        try:
            user = g.record
            json = request.get_json()
            for attr in json:
                value = json.get(attr)
                print(f"{attr} - {value}")
                if (attr == 'new_password'):
                    if (value != ""):
                        user.password_hash = value
                        print("New password set.")
                else:
                    if (getattr(user, attr) != value):
                        setattr(user, attr, value)
            db.session.add(user)
            db.session.commit()
            return user.to_dict(), 200
        except ValueError as e:
            print(e)
            return {'error': 'Not Modified'}, 304