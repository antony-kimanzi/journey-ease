from flask import Blueprint, jsonify, request
from flask_jwt_extended import create_access_token, jwt_required, get_jwt, get_jwt_identity
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
from datetime import timezone
from models import User, TokenBlocklist, db
from flask_cors import CORS


user_bp = Blueprint("user_bp", __name__)
CORS(user_bp, supports_credentials=True, origins=["https://journey-ease-website.vercel.app"])

@user_bp.route("/user/register", methods=["OPTIONS"])
@user_bp.route("/user/login", methods=["OPTIONS"])
def options():
    return jsonify({"message": "CORS Preflight Successful"}), 200


@user_bp.after_request
def add_cors_headers(response):
    response.headers["Access-Control-Allow-Origin"] = "https://journey-ease-website.vercel.app"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PATCH, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response


@user_bp.route("/user/register", methods=["POST"])
def add_user():
    data = request.get_json()
    username = data["username"]
    email = data["email"]
    password = generate_password_hash(data["password"])
    phone_number = data["phoneNumber"]
    
    
    if len(phone_number) != 10 :
        return jsonify({"error": "Phone number should be valid"})
    
    check_name = User.query.filter_by(username=username).first()
    check_email = User.query.filter_by(email=email).first()
    check_number = User.query.filter_by(phone_number=phone_number).first()

    if check_name:
        return jsonify({"error": "Username already exists"})
    else:
        if check_email:
            return jsonify({"error": "Email already exists"})
        else:
            if check_number:
                return jsonify({"error": "Phone number already exists"})
            else:
                new_user = User(username=username, email=email, password=password, phone_number=phone_number)
                db.session.add(new_user)
                db.session.commit()

                return jsonify({"success": "user registered successfully"})
            
@user_bp.route("/user/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data["email"]
    password = data["password"]
    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=str(user.id))
        response = jsonify({"access_token": access_token})
    else:
        response = jsonify({"error": "Invalid email or password"}), 400

    response.headers.add("Access-Control-Allow-Origin", "https://journey-ease-website.vercel.app")
    response.headers.add("Access-Control-Allow-Credentials", "true")

    return response


@user_bp.route("/user/profile")    
@jwt_required()
def user_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user:
        return jsonify({"username": user.username, "email": user.email, "phone_number": user.phone_number})
    else:
        return jsonify({"error": "User doesn't exist"})
    
@user_bp.route("/user/updateprofile", methods=["PATCH"])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user:
        data = request.get_json()
        username = data.get("username", user.username)
        email = data.get("email", user.email)
        phone_number = data.get("phone_number", user.phone_number)

        user.username = username
        user.email = email
        user.phone_number = phone_number
        
        db.session.commit()
        return jsonify({"success": "profile updated successfully"})
    else:
        return jsonify({"error": "User wasn't found"})
    
@user_bp.route("/user/deleteaccount", methods=["DELETE"])
@jwt_required()
def delete_account():
    user_id = get_jwt_identity()
    user = db.session.get(User, user_id)

    if user:
        db.session.delete(user)        
        db.session.commit()
        return jsonify({"success": "account deleted successfully"})
    else:
        return jsonify({"error": "User wasn't found"})

@user_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)
    if jti:
        db.session.add(TokenBlocklist(jti=jti, created_at=now))
        db.session.commit()
        return jsonify({"success":"Logged out successfully"})
    else:
        return jsonify({"error": "User wasn't logged in"})

