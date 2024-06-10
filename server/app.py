#!/usr/bin/env python3

from flask import request, session, g, render_template, send_from_directory
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from models.models import *
from resources.resources import *
from config import app, db, api


@app.before_request
def check_if_logged_in():
  """This view will be run to check if there's a logged in user before attempting to access other data.

  Returns:
      JSON: if a user is not logged in, then an "Unauthorized" message will be returned.
  """
  endpoint_whitelist = ['signup', 'login', 'check_session']
  if not (session.get('user_id') or request.endpoint in endpoint_whitelist):
    return {'error': 'Unauthorized'}, 401

@app.before_request
def get_record_by_id():
  """If accessing a model record, this view will run to get the model by id. The correct model will be matched by
    the endpoint.

  Returns:
      any: if the model record does not exist, then a "not found" message will be returned; otherwise, returns nothing. 
  """
  endpoint_model_map = {
    'user_by_id': User,
    'item_by_id': Item,
    'organization_by_id': Organization,
    'membership_by_id': Membership,
    'assignment_by_id': Assignment,
    'request_by_id': Request
  }
  if model := endpoint_model_map.get(request.endpoint):
    id = request.view_args.get('id')
    if record := model.query.filter_by(id=id).first():
      g.record = record
    else:
      return {'error': f'{model.__name__} record of id, {id}, does not exist. Please try again later.'}, 404
  #print(request.endpoint)
  
class Signup(Resource):
  """Create a new user."""
  
  def post(self):
    """Creates a new instance of User.

    Returns:
        dict: a JSONified dictionary of the created User and its attributes, if creation successful, otherwise an error message.
    """
    # Retrieve form inputs
    try:
      new_user = User(
        first_name=request.get_json().get('first_name'),
        last_name=request.get_json().get('last_name'),
        username=request.get_json().get('username'),
        email=request.get_json().get('email'),
        is_verified=True
      )
      new_user.password_hash = request.get_json().get('password')
      db.session.add(new_user)
      db.session.commit()
      session['user_id'] = new_user.id
      return new_user.to_dict(), 201
    except (IntegrityError, ValueError) as e:
      print(e)
      return {'message': str(e)}, 422
  
class Login(Resource):
  """Logs user into the account."""
  def post(self):
    """Sets the session's user_id, so that the user has authorization to access appropriate data.

    Returns:
        JSON: the JSONified user object, if entered password is correct; an "Unauthorized" message otherwise.
    """
    login_name = request.get_json().get('username_or_email')
    print(login_name)
    if login_name:
      user = User.query.filter_by(username=login_name).first() or User.query.filter_by(email=login_name).first()
      if user and user.authenticate(request.get_json().get('password')):
        print(user)
        session['user_id'] = user.id
        return user.to_dict(), 200
    return {'message': '401 Unauthorized'}, 401
  
class Logout(Resource):
  """Logs user out of the webiste."""
  def delete(self):
    """_summary_

    Returns:
        _type_: _description_
    """
    print("About to log out.")
    session['user_id'] = None
    print("Logging out")
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
    if user := User.query.filter_by(id=session.get('user_id')).first():
      return user.to_dict(), 200
    return {'message': '401 Unauthorized'}, 401
  
class Index(Resource):
    def get(self):
        return send_from_directory("../client/dist", "index.html")
        
api.add_resource(Index, "/")
api.add_resource(Signup, '/api/signup', endpoint='signup')
api.add_resource(Login, '/api/login', endpoint='login')
api.add_resource(Logout, '/api/logout', endpoint='logout')
api.add_resource(CheckSession, '/api/check_session', endpoint='check_session')
api.add_resource(UserById, '/api/users/<int:id>', endpoint='user_by_id')

# @app.route('/')
# def index():
#     return '<h1>Phase 5 Project ... In Progress</h1>'

# Views go here! use either route!
# @app.errorhandler(404)
# def not_found(e):
#     return render_template("index.html")

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    return render_template("index.html")

if __name__ == '__main__':
    app.run(port=5555, debug=True)

