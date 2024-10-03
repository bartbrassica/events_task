from flask import Flask
from flask_migrate import Migrate

from .config import Config
from .extensions import db, ma, jwt
from .auth.views import auth_bp
from flask_cors import CORS


app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
ma.init_app(app)
jwt.init_app(app)
migrate = Migrate(app, db)
CORS(app)

app.register_blueprint(auth_bp, url_prefix='/auth')

if __name__ == '__main__':
    app.run(debug=True)
