"""
SafaRi AI — API route handlers
"""

import base64
from flask import Blueprint, request, jsonify
from google import genai
from google.genai import types
from prompts import SYSTEM_PROMPT, ROUTE_PROMPT_TEMPLATE, HAZARD_PROMPT

api = Blueprint("api", __name__, url_prefix="/api")


def get_client():
    """Get the Gemini client from the app config."""
    from flask import current_app
    return current_app.config["GEMINI_CLIENT"]


# ─── Health Check ───────────────────────────────────────────────
@api.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "SafaRi AI"})


# ─── Route Finder ───────────────────────────────────────────────
@api.route("/route", methods=["POST"])
def find_route():
    """Find matatu route between two points in Nairobi."""
    data = request.get_json()

    if not data or not data.get("origin") or not data.get("destination"):
        return jsonify({"error": "Both 'origin' and 'destination' are required"}), 400

    origin = data["origin"].strip()
    destination = data["destination"].strip()

    route_prompt = ROUTE_PROMPT_TEMPLATE.format(origin=origin, destination=destination)

    try:
        client = get_client()
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=route_prompt,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.7,
                max_output_tokens=1024,
            ),
        )

        return jsonify({
            "origin": origin,
            "destination": destination,
            "advice": response.text,
        })

    except Exception as e:
        return jsonify({"error": f"Gemini API error: {str(e)}"}), 500


# ─── Road Hazard Reporter ──────────────────────────────────────
@api.route("/hazard", methods=["POST"])
def report_hazard():
    """Analyze a road hazard image using Gemini Vision."""

    if "image" not in request.files:
        return jsonify({"error": "No image file uploaded"}), 400

    image_file = request.files["image"]

    if image_file.filename == "":
        return jsonify({"error": "No image selected"}), 400

    try:
        image_bytes = image_file.read()
        image_base64 = base64.b64encode(image_bytes).decode("utf-8")

        # Determine MIME type
        content_type = image_file.content_type or "image/jpeg"

        client = get_client()
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=[
                types.Content(
                    role="user",
                    parts=[
                        types.Part.from_bytes(data=image_bytes, mime_type=content_type),
                        types.Part.from_text(text=HAZARD_PROMPT),
                    ],
                )
            ],
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.5,
                max_output_tokens=1500,
            ),
        )

        return jsonify({
            "analysis": response.text,
            "image_received": True,
        })

    except Exception as e:
        return jsonify({"error": f"Gemini API error: {str(e)}"}), 500


# ─── Chat Assistant ─────────────────────────────────────────────
@api.route("/chat", methods=["POST"])
def chat():
    """Conversational chat with SafaRi AI, maintains history."""
    data = request.get_json()

    if not data or not data.get("message"):
        return jsonify({"error": "'message' is required"}), 400

    user_message = data["message"].strip()
    history = data.get("history", [])

    try:
        # Build conversation contents from history
        contents = []
        for msg in history:
            role = msg.get("role", "user")
            text = msg.get("text", "")
            contents.append(
                types.Content(
                    role=role,
                    parts=[types.Part.from_text(text=text)],
                )
            )

        # Add the new user message
        contents.append(
            types.Content(
                role="user",
                parts=[types.Part.from_text(text=user_message)],
            )
        )

        client = get_client()
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=contents,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                temperature=0.8,
                max_output_tokens=1024,
            ),
        )

        return jsonify({
            "response": response.text,
        })

    except Exception as e:
        return jsonify({"error": f"Gemini API error: {str(e)}"}), 500
