import contextlib
from datetime import datetime
from sqlalchemy import Column, Integer, DateTime, Sequence
from sqlalchemy.ext.declarative import declared_attr

from backend.extensions import db


def PkColumn(seq_name: str):
    """
    Creates a primary key column with an auto-incrementing sequence for a SQLAlchemy model.

    Args:
        seq_name (str): The name of the sequence to be used for generating unique values for the column.
    """
    return db.Column(Integer, Sequence(seq_name, start=1, increment=1), primary_key=True)


@contextlib.contextmanager
def commit_section():
    """
    Provide a transactional scope around a series of operations.
    Commits the session if no exceptions occur; otherwise, rolls back.
    """
    try:
        yield None
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        raise e


def _current_user_id():
    # TODO
    # from auth.db_utils import get_current_user_id

    # return get_current_user_id()
    return 1


class CreateModifyMixin:

    @declared_attr
    def created_by(self):
        return Column(Integer, nullable=False, default=_current_user_id)

    @declared_attr
    def creation_date(self):
        return Column(DateTime, nullable=False, default=datetime.now())

    @declared_attr
    def updated_by(self):
        return Column(Integer, onupdate=_current_user_id)

    @declared_attr
    def update_date(self):
        return Column(DateTime, onupdate=datetime.now())
