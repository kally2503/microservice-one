import os
from datetime import datetime, timezone
from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

VERSION = "1.0-SNAPSHOT"

USERS = [
    {"id": 1, "name": "Alice Johnson", "email": "alice@kaeliq.com", "role": "admin"},
    {"id": 2, "name": "Bob Smith", "email": "bob@kaeliq.com", "role": "developer"},
    {"id": 3, "name": "Carol White", "email": "carol@kaeliq.com", "role": "analyst"},
]


@app.route("/api/health")
def health():
    return jsonify({
        "status": "UP",
        "service": "python-service",
        "version": VERSION,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    })


@app.route("/api/info")
def info():
    return jsonify({
        "service": "python-service",
        "description": "Python Flask Microservice",
        "version": VERSION,
        "build": os.environ.get("BUILD_NUMBER", "local"),
    })


@app.route("/api/users")
def get_users():
    return jsonify(USERS)


@app.route("/api/users/<int:user_id>")
def get_user(user_id):
    user = next((u for u in USERS if u["id"] == user_id), None)
    if user is None:
        return jsonify({"error": "User not found"}), 404
    return jsonify(user)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
