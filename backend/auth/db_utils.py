from werkzeug.security import generate_password_hash

from backend.extensions import db
from .models import User


def get_user_by_filters(*, username=None):
    q = db.session.query(
        User
    )
    if username:
        q = q.filter(User.username == username)

    return q.first()


def create_user(param):
    new_user = User(
        username=param['username'],
        email=param['email'],
        first_name=param['first_name'],
        last_name=param['last_name'],
        password_hash=generate_password_hash(param['password']),
    )
    db.session.add(new_user)
    db.session.flush()

    return new_user
