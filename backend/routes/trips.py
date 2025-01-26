from flask import Blueprint, jsonify, request
from models import Trip, db

trip_bp = Blueprint("trip_bp", __name__)