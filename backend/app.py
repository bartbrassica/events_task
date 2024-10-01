from flask import Flask
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

from .config import Config
from .extensions import db, ma
from .auth.views import auth_bp

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
ma.init_app(app)
migrate = Migrate(app, db)
jwt = JWTManager(app)

app.register_blueprint(auth_bp, url_prefix='/auth')

if __name__ == '__main__':
    app.run(debug=True)
