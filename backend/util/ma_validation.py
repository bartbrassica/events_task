from functools import wraps
from flask import request, jsonify
from marshmallow import ValidationError


def validate_request(schema):
    """
    Decorator to validate the incoming request data against a Marshmallow schema.

    Args:
        schema (Schema): A Marshmallow schema to validate the incoming data.

    Returns:
        A wrapped function that validates the request before proceeding.
    """
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            try:
                validated_data = schema.load(request.get_json())
            except ValidationError as err:
                return jsonify({"errors": err.messages}), 400

            return fn(*args, validated_data=validated_data, **kwargs)

        return wrapper
    return decorator
