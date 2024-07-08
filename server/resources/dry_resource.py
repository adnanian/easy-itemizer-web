from flask import request, g
from flask_restful import Resource
from config import db


class DRYResource(Resource):
    """
    Template for RESTful CRUD methods.
    """

    def __init__(self, model, key_name=None):
        """Creates a new instance of RestResourceTemplate.

        Args:
            model (db.Model): the model to tie the resource to.
            key_name (str): the key name to use to create a dict inside a dict. (For logging POST, PATCH, and DELETE requests).
        """
        self.model = model
        self.key_name = key_name

    def get(self, id=None):
        """
        If an id is specified, then retrieves a db.Model record with that id if it exists.
        If the record with that id does not exist, then returns a message saying "not found".
        Otherwise, returns all records.
        """
        if type(id) is int:
            record = g.record
            return record.to_dict(), 200
        else:
            records = [record.to_dict() for record in self.model.query.all()]
            return records, 200

    def patch(self, id):
        """Updates a db.Model record with a given id.

        Args:
            id (int): the id.

        Returns:
            dict: a JSONified dictionary of the record if successfully updated; if update failed, then will
            return a "Not Modified" message. If record with id, does not exist, a "Not Found" will be returned.
        """
        try:
            record = g.record
            json = request.get_json()
            for attr in json:
                value = json.get(attr)
                if getattr(record, attr) != value:
                    setattr(record, attr, value)
                # print(f"Attrname: {attr}, Type: {type(json.get(attr))}")
                # setattr(record, attr, json.get(attr))
            db.session.add(record)
            db.session.commit()
            if self.key_name:
                return_dict = {}
                return_dict[self.key_name] = record.to_dict()
                return return_dict, 200
            return record.to_dict(), 200
        except ValueError as e:
            print(e)
            return {"error": "Not Modified"}, 304

    def delete(self, id):
        """Deletes a db.Model record with a given id.

        Args:
            id (int): the id.

        Returns:
            dict: no content or a message saying that the record was deleted.
        """
        record = g.record
        if self.key_name:
            serialized_record = record.to_dict()
        db.session.delete(record)
        db.session.commit()
        if self.key_name:
            return_dict = {}
            # print(record, flush=True)
            return_dict[self.key_name] = serialized_record
            return return_dict, 204
        return {"message": f"{self.model.__name__} successfully deleted."}, 204
