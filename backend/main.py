"""
SafaRi AI — Flask backend entry point
"""

import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

load_dotenv()


def create_app():
    app = Flask(__name__)
    CORS(app)

    # Initialize Gemini client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key or api_key == "your-api-key-here":
        print("⚠️  WARNING: Set your GEMINI_API_KEY in backend/.env")

    client = genai.Client(api_key=api_key)
    app.config["GEMINI_CLIENT"] = client

    # Register API routes
    from routes import api
    app.register_blueprint(api)

    @app.route("/")
    def index():
        return {"message": "🚌 SafaRi AI Backend is running!"}

    return app


app = create_app()