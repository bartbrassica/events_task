from sqlalchemy import Column, Unicode, Boolean

from backend.util.db import PkColumn, CreateModifyMixin
from backend.extensions import db


class User(db.Model, CreateModifyMixin):
    __tablename__ = 'users'

    id = PkColumn('user_id_seq')
    username = Column(Unicode(100), unique=True, nullable=False)
    email = Column(Unicode(100), nullable=False)
    first_name = Column(Unicode(100), nullable=False)
    last_name = Column(Unicode(100), nullable=False)
    password_hash = Column(Unicode(255), nullable=False)
    active = Column(Boolean, nullable=False, default=True)

    @property
    def full_name(self) -> str:
        return f'{self.first_name} {self.last_name}'.strip()
