from flask import Blueprint, jsonify, request
from models import Reservation, db

reservation_bp = Blueprint("reservation_bp", __name__)