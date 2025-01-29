from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData

metadata = MetaData()
db = SQLAlchemy(metadata = metadata)

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    username = db.Column(db.String(40), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(40), unique=True, nullable=False)
    phone_number = db.Column(db.Integer, nullable=False)

    trip = db.relationship("Trip", back_populates="user", cascade='all, delete-orphan')

class Trip(db.Model):
    __tablename__ = "trips"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    trip_ref = db.Column(db.String(50), unique=True, nullable=False)
    country = db.Column(db.String(40), nullable=False)
    trip_activity = db.Column(db.String(256), nullable=False)
    duration = db.Column(db.String(40), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    user = db.relationship("User", back_populates="trip")
    reservation = db.relationship("Reservation", back_populates="trip", cascade="all, delete-orphan")

class Reservation(db.Model):
    __tablename__ = "reservations"

    id = db.Column(db.Integer, primary_key=True, nullable=False)
    reservation_ref = db.Column(db.String(50), unique=True, nullable=False)
    type = db.Column(db.String(256), nullable=False)
    cost = db.Column(db.Float, nullable=False)
    reservation_date = db.Column(db.DateTime, nullable=False)
    trip_id = db.Column(db.Integer, db.ForeignKey("trips.id"), nullable=False)

    trip = db.relationship("Trip", back_populates="reservation")

class TokenBlocklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    created_at = db.Column(db.DateTime, nullable=False)