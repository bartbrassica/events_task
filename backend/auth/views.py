from flask import Blueprint, jsonify
from flask.views import MethodView
from datetime import datetime, timedelta, timezone
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, create_refresh_token, get_jwt
from werkzeug.security import check_password_hash

from backend.util.ma_validation import validate_request
from backend.util.db import commit_section
from backend.util.jwt import BLACKLIST
from .db_utils import create_user, get_user_by_filters
from .ma_schemas import RegisterSchema, LoginSchema
from .models import User


class Register(MethodView):
    @validate_request(RegisterSchema())
    def post(self, param):
        user = get_user_by_filters(username=param['username'])
        if user:
            return jsonify({"message": "User already exists!"}), 400

        with commit_section():
            new_user = create_user(param)

        return jsonify(
            user_id=new_user.id
        ), 201


class Login(MethodView):
    @validate_request(LoginSchema())
    def post(self, param):
        user = get_user_by_filters(username=param['username'])
        if user is None or not check_password_hash(user.password_hash, param['password']):
            return jsonify({"message": "Invalid username or password"}), 401

        access_token = create_access_token(identity=param['username'])
        refresh_token = create_refresh_token(identity=param['username'])

        token_expiration = datetime.now(timezone.utc) + timedelta(hours=1)
        token_life = token_expiration.isoformat()

        return jsonify(
            user_id=user.id,
            access_token=access_token,
            refresh_token=refresh_token,
            token_life=token_life
        ), 200


class TokenRefresh(MethodView):
    @jwt_required(refresh=True)
    def post(self):
        current_user = get_jwt_identity()
        new_access_token = create_access_token(identity=current_user, fresh=False)

        return jsonify(access_token=new_access_token), 200


class Users(MethodView):
    def get(self):
        users = User.query.all()
        return jsonify(users), 200


class Logout(MethodView):
    @jwt_required()
    def post(self):
        jti = get_jwt()['jti']
        BLACKLIST.add(jti)
        return jsonify({"message": "Successfully logged out"}), 200


auth_bp = Blueprint('auth', __name__)
auth_bp.add_url_rule('/register', view_func=Register.as_view('register'))
auth_bp.add_url_rule('/login', view_func=Login.as_view('login'))
auth_bp.add_url_rule('/users', view_func=Users.as_view('users'))
auth_bp.add_url_rule('/refresh', view_func=TokenRefresh.as_view('refresh'))
auth_bp.add_url_rule('/logout', view_func=Logout.as_view('logout'))
