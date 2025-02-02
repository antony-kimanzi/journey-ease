from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Trip, User, db
import uuid

trip_bp = Blueprint("trip_bp", __name__)

@trip_bp.route("/trips")
@jwt_required()
def trips():
    user_id = get_jwt_identity()

    trips = Trip.query.filter_by(user_id=user_id).all()
    if trips:
        trip_list = [{"id":trip.id, "trip_ref": trip.trip_ref, "country": trip.country, "trip_activity": trip.trip_activity, "duration": trip.duration} for trip in trips]

        return jsonify(trip_list)
    else:
        return jsonify({"error": "no trips scheduled by user"})
    
@trip_bp.route("/trip/<int:trip_id>")
@jwt_required()
def fetch_one_trip(trip_id):
    user_id = get_jwt_identity()

    trip = Trip.query.filter_by(user_id=user_id, id=trip_id).first()

    if trip:
        return jsonify({"id":trip.id, "trip_ref": trip.trip_ref, "country": trip.country, "trip_activity": trip.trip_activity, "duration": trip.duration})
    else:
        return jsonify({"error": "Trip not found"})

@trip_bp.route("/trip/addtrip", methods=["POST"])
@jwt_required()
def add_trip():
    user_id = get_jwt_identity()
    user = User.query.filter_by(id=user_id).first()

    if user:
        data = request.get_json()

        trip_ref = str(uuid.uuid4().hex[:4]).upper()
        country = data["country"]
        trip_activity = data["tripActivity"]
        duration = data["duration"]

        check_trip=Trip.query.filter_by(country=country, trip_activity=trip_activity, duration=duration, user_id=user.id).first()

        if check_trip:
            return jsonify({"error": "Trip already exists"})
        else:
            new_trip = Trip(trip_ref=trip_ref, country=country, trip_activity=trip_activity, duration=duration, user_id=user.id)

            db.session.add(new_trip)
            db.session.commit()
            return jsonify({"success": "Trip added successfully"})
        
    else:
        return jsonify({"error": "user needs to login"})
    
@trip_bp.route("/trip/update/<int:trip_id>", methods=["PATCH"])
@jwt_required()
def update_trip(trip_id):
    user_id = get_jwt_identity()

    if user_id:
        trip = Trip.query.filter_by(user_id=user_id, id=trip_id).first()

        if trip:
            data = request.get_json()
            country = data.get("country", trip.country)
            trip_activity =  data.get("tripActivity", trip.trip_activity)
            duration = data.get("duration", trip.duration)

            trip.country = country
            trip.trip_activity = trip_activity
            trip.duration = duration
            db.session.commit()

            return jsonify({"success": "Trip updated successfully"})
    else:
        return jsonify({"error": "user needs to login"})
    
@trip_bp.route("/trip/delete/<int:trip_id>", methods=["DELETE"])
@jwt_required()
def delete_trip(trip_id):
    user_id = get_jwt_identity()

    user = User.query.filter_by(id=user_id).first()
    if user:
        trip = Trip.query.filter_by(user_id=user_id, id=trip_id).first()
        if trip:
            db.session.delete(trip)
            db.session.commit()
            return jsonify({"success": "Trip has been deleted"})
        else:
            return jsonify({"error": "Trip has not been found"})
        
    else:
        return jsonify({"error": "user needs to login"})

