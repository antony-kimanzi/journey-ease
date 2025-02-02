from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Reservation, Trip, db
from datetime import datetime
import uuid

reservation_bp = Blueprint("reservation_bp", __name__)

@reservation_bp.route("/reservations/<int:trip_id>")
@jwt_required()
def reservations(trip_id):
    user_id = get_jwt_identity()

    if user_id:
        trip = Trip.query.filter_by(id=trip_id,user_id=user_id).first()
        if trip:
            reservations = Reservation.query.filter_by(trip_id=trip.id).all()
            if reservations:
                reservation_list = [{"id":reservation.id, "reservation_ref":reservation.reservation_ref, "reservation_type": reservation.type, "cost": reservation.cost, "reservation_date": reservation.reservation_date} for reservation in reservations]

                return jsonify(reservation_list)
            else:
                return jsonify({"error": "no reservations made"})
        else:
            return jsonify({"error": "User hasn't scheduled any trip"})
    else:
        return jsonify({"error": "user needs to login"})
    
    
    
@reservation_bp.route("/reservation/add/<int:trip_id>", methods=["POST"])
@jwt_required()
def add_reservation(trip_id):
    user_id = get_jwt_identity()

    if user_id:
        trip = Trip.query.filter_by(id=trip_id,user_id=user_id).first()

        if trip:
            data = request.get_json()

            res_date = datetime.strptime(data["reservation_date"], "%Y-%m-%d").date()
            res_type = data["type"]
            res_cost = data["cost"]
            res_ref = str(uuid.uuid4().hex[:4]).upper()

            check_reservation = Reservation.query.filter_by(reservation_date=res_date, type=res_type, cost=res_cost, trip_id=trip.id).first()

            if check_reservation:
                return jsonify({"error": "reservation already exist"})
            else:
                new_reservation = Reservation(reservation_ref=res_ref, type=res_type, cost=res_cost, reservation_date=res_date, trip_id=trip.id)

                db.session.add(new_reservation)
                db.session.commit()

                return jsonify({"success": "reservation added successfully"})
        else:
            return jsonify({"error": "No trip to make a reservation for"})
        
    else:
        return jsonify({"error": "User needs to login"})
    
    
@reservation_bp.route("/reservation/update/<int:trip_id>/<int:reservation_id>", methods=["PATCH"])
@jwt_required()
def update_reservation(trip_id, reservation_id):
    user_id = get_jwt_identity()

    if user_id:
        trip = Trip.query.filter_by(id=trip_id,user_id=user_id).first()

        if trip:
            reservation = Reservation.query.filter_by(id=reservation_id, trip_id=trip.id).first()

            if reservation:
                data = request.get_json()
            
                res_type = data.get("type", reservation.type)
                res_cost = data.get("cost", reservation.cost)
                if data["reservation_date"]:
                    res_date = datetime.strptime(data["reservation_date"], "%Y-%m-%d").date()
                else:
                    res_date = reservation.reservation_date

                check_reservation = Reservation.query.filter_by(reservation_date=res_date, type=res_type, cost=res_cost, trip_id=trip.id).first()

                if check_reservation:
                    return jsonify({"error": "reservation already exists"})
                else:
                    reservation.type = res_type
                    reservation.cost = res_cost
                    reservation.reservation_date = res_date

                    db.session.commit()

                    return jsonify({"success": "reservation updated successfully"})
                
            else:
                return jsonify({"error": "reservation not found"})
        else:
            return jsonify({"error": "No trip to make a reservation for"})
    else:
        return jsonify({"error": "User needs to login"})
    
@reservation_bp.route("/reservation/delete/<int:trip_id>/<int:reservation_id>", methods=["DELETE"])
@jwt_required()
def delete_reservation(trip_id, reservation_id):
    user_id = get_jwt_identity()

    if user_id:
        trip = Trip.query.filter_by(id=trip_id,user_id=user_id).first()
        if trip:
            reservation = Reservation.query.filter_by(id=reservation_id, trip_id=trip.id).first()
            if reservation:
                db.session.delete(reservation)
                db.session.commit()
                return jsonify({"success": "reservation cancelled successfully"})
            else:
                return jsonify({"error": "reservation doesn't exist"})
            
        else:
            return jsonify({"error": "User hasn't scheduled any trip"})
        
    else:
        return jsonify({"error": "user needs to login"})

