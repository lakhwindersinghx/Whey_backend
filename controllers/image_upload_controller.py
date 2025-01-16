import os
from flask import Blueprint, request, jsonify
from werkzeug.utils import secure_filename
from utils.ocr_util import extract_text_from_image
from services.ingredient_service import analyze_ingredients

# Blueprint for image upload
image_upload_bp = Blueprint("image_upload", __name__)
UPLOAD_FOLDER = "./uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    """Check if the file has an allowed extension."""
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def clean_extracted_text(extracted_text):
    """Clean and structure the extracted text to get a list of ingredients."""
    # Remove common prefixes and split text by commas
    extracted_text = extracted_text.replace("Ingredients:", "").strip()
    ingredients = extracted_text.replace("\n", " ").split(",")  # Replace newlines and split
    ingredients = [ingredient.strip() for ingredient in ingredients if ingredient.strip()]
    return ingredients

def split_nested_ingredients(ingredients):
    split_ingredients = []
    for ingredient in ingredients:
        # Split nested ingredients within parentheses
        if "(" in ingredient and ")" in ingredient:
            base, nested = ingredient.split("(", 1)
            nested = nested.rstrip(")")
            split_ingredients.append(base.strip())
            split_ingredients.extend([sub.strip() for sub in nested.split(",")])
        else:
            split_ingredients.append(ingredient)
    return split_ingredients


@image_upload_bp.route("/upload-label", methods=["POST"])
def upload_label():
    try:
        file_key = list(request.files.keys())[0]
        file = request.files[file_key]

        # Save the file
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Extract text from the image
        extracted_text = extract_text_from_image(file_path)
        if not extracted_text:
            return jsonify({"error": "Failed to extract text from the image"}), 500

        # Log extracted text
        print(f"Extracted text: {extracted_text}")
  

        cleaned_ingredients = clean_extracted_text(extracted_text)
        final_ingredients = split_nested_ingredients(cleaned_ingredients)
        print("after cleaning")
        # Analyze the extracted ingredients
        analysis_result = analyze_ingredients(final_ingredients)
        print("after analysis")

        return jsonify({
            "message": "File uploaded successfully",
            # "extracted_text": extracted_text,
            # "cleaned_ingredients": cleaned_ingredients,
            "final_ingredients": final_ingredients,
            "analysis": analysis_result
        }), 200
    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": "Internal server error"}), 500
