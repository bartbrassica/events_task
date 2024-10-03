from sqlalchemy import Column, ForeignKey, Integer, Boolean, Unicode, DateTime, UnicodeText

from backend.util.db import PkColumn, CreateModifyMixin
from sqlalchemy.orm import relationship
from backend.extensions import db


class Event(db.Model, CreateModifyMixin):
    __tablename__ = 'events'

    id = PkColumn('events_id_seq')
    name = Column(Unicode(255), nullable=False)
    description = Column(UnicodeText, nullable=True)
    date = Column(DateTime, nullable=False)
    duration = Column(Integer, nullable=False)
    location = Column(Unicode(255), nullable=False)

    # Relationships
    participants = relationship('EventParticipants', back_populates='event', cascade="all, delete-orphan")


class Participant(db.Model):
    __tablename__ = 'participants'

    id = PkColumn('participants_id_seq')
    first_name = Column(Unicode(100), nullable=False)
    last_name = Column(Unicode(100), nullable=False)
    email = Column(Unicode(255), unique=True, nullable=False)
    is_vegetarian = Column(Boolean, nullable=False, default=False)

    # Relationships
    events = relationship('EventParticipants', back_populates='participant', cascade="all, delete-orphan")


class EventParticipant(db.Model, CreateModifyMixin):
    __tablename__ = 'event_participants'

    id = PkColumn('event_participants_id_seq')
    event_id = Column(Integer, ForeignKey('events.id'), nullable=False)
    participant_id = Column(Integer, ForeignKey('participants.id'), nullable=False)
    days_in_event = Column(Integer, nullable=False)
    is_event_organizer = Column(Boolean, nullable=False, default=False)

    # Relationships
    event = relationship('Event', back_populates='participants')
    participant = relationship('Participant', back_populates='events')
