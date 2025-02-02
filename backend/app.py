from flask import Flask
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from datetime import timedelta
from models import TokenBlocklist, db
from flask_cors import CORS

app = Flask(__name__)
CORS(
    app,
    resources={r"/*": {"origins": "https://journeyease-five.vercel.app"}},
    supports_credentials=True
)



app.config["SQLALCHEMY_DATABASE_URI"] = "postgresql://traveldb_oite_user:UYD7fHKipsY8cIpj2w4dItPuEqDFJQZv@dpg-cufq0ftds78s73fngheg-a.oregon-postgres.render.com/traveldb_oite"

migrate = Migrate(app, db)
db.init_app(app)

app.config["JWT_SECRET_KEY"] = "abcdef$Xz!2@#1pQz*7d9_lR$32!89qweT^2aU!"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(days=7)
jwt = JWTManager(app)
jwt.init_app(app)

from routes import *

app.register_blueprint(user_bp)
app.register_blueprint(trip_bp)
app.register_blueprint(reservation_bp)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None
