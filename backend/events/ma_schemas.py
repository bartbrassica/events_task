from marshmallow import Schema, fields


class EventSchema(Schema):
    name = fields.String(required=True)
    description = fields.String()
    date = fields.DateTime(required=True)
    location = fields.String(required=True)
    duration = fields.Integer(required=True)


class ParticipantSchema(Schema):
    first_name = fields.String(required=True)
    last_name = fields.String(required=True)
    email = fields.Email(required=True)
    is_vegetarian = fields.Boolean(required=True)


class EventParticipantsSchema(Schema):
    event_id = fields.Integer(required=True)
    participant_id = fields.Integer(required=True)
    days_in_event = fields.Integer(required=True)
    is_event_organizer = fields.Boolean(required=True)


class MealsOnEventSchema(Schema):
    id = fields.Integer(dump_only=True)
    name = fields.String(required=True)
    meal_type = fields.String(required=True)
    is_vegetarian = fields.Boolean(required=True)
    event_id = fields.Integer(required=True)


class ParticipantMealsOnEventSchema(Schema):
    id = fields.Integer(dump_only=True)
    meal_id = fields.Integer(required=True)
    participant_id = fields.Integer(required=True)
    is_special_request = fields.Boolean(required=True)
