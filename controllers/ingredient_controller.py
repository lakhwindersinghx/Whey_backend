from flask import Blueprint, request, jsonify
from services.ingredient_service import analyze_ingredients


ingredient_bp = Blueprint("ingredient", __name__)

@ingredient_bp.route("/analyze-ingredients", methods=["POST"])
def analyze_ingredients_endpoint():  # Renamed to avoid conflict
    try:
        # Parse the JSON request
        data = request.json
        if not data or "ingredients" not in data:
            return jsonify({"error": "Invalid input. 'ingredients' field is required."}), 400

        ingredients = data.get("ingredients", [])
        if not isinstance(ingredients, list) or not all(isinstance(i, str) for i in ingredients):
            return jsonify({"error": "Invalid input. 'ingredients' must be a list of strings."}), 400

        # Call the service function
        response = analyze_ingredients(ingredients)

        return jsonify(response)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500
