#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request, render_template
from flask_restful import Resource
from models.models import *

# Local imports
from config import app, db, api
# Add your model imports




@app.route('/')
def index():
    return '<h1>Phase 5 Project ... In Progress</h1>'

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

