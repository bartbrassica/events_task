from marshmallow import Schema, fields


class EventSchema(Schema):
    name = fields.String(required=True)
    description = fields.String()
    date = fields.DateTime(required=True)
    location = fields.String(required=True)


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
