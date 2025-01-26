from flask import Blueprint, jsonify, request
from models import User, db

user_bp = Blueprint("user_bp", __name__)



