import os
from flask import Blueprint, request, jsonify, make_response
from werkzeug.utils import secure_filename
from utils.ocr_util import extract_text_from_image
from services.ingredient_service import analyze_ingredients
from services.nutrition_service import analyze_nutritional_info
from flask_cors import CORS

# Blueprint for image upload
image_upload_bp = Blueprint("image_upload", __name__)
UPLOAD_FOLDER = "./uploads"
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}
CORS(image_upload_bp)

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

def allowed_file(filename):
    return "." in filename and filename.rsplit(".", 1)[1].lower() in ALLOWED_EXTENSIONS

def split_label_sections(text):
    """
    Split the label into 'nutrition' and 'ingredients' sections using keywords.
    """
    nutrition_keywords = ["Nutrition Facts", "Supplement Facts", "Amount Per Serving"]
    ingredient_keywords = ["Ingredients", "Other Ingredients", "Contains"]

    nutrition_section = []
    ingredient_section = []
    current_section = None

    for line in text.split("\n"):
        line = line.strip()

        # Determine which section we are in
        if any(keyword.lower() in line.lower() for keyword in nutrition_keywords):
            current_section = "nutrition"
        elif any(keyword.lower() in line.lower() for keyword in ingredient_keywords):
            current_section = "ingredients"

        # Add lines to the appropriate section
        if current_section == "nutrition":
            nutrition_section.append(line)
        elif current_section == "ingredients":
            ingredient_section.append(line)

    # Join the lines into text blocks
    nutrition_text = " ".join(nutrition_section)
    ingredient_text = " ".join(ingredient_section)

    # Clean the ingredients section
    ingredient_text = ingredient_text.replace("Ingredients:", "").strip()
    ingredients_list = [ing.strip() for ing in ingredient_text.split(",") if ing.strip()]

    return nutrition_text, ingredients_list

@image_upload_bp.route("/upload-label", methods=["POST"])
def upload_label():
    try:
        file_key = list(request.files.keys())[0]
        file = request.files[file_key]

        # Save the uploaded file
        filename = secure_filename(file.filename)
        file_path = os.path.join(UPLOAD_FOLDER, filename)
        file.save(file_path)

        # Perform OCR to extract text
        extracted_text = extract_text_from_image(file_path)
        if not extracted_text:
            return make_response(jsonify({"error": "Failed to extract text from the image"}), 500)

        # Split the label into nutrition info and ingredients
        nutrition_text, cleaned_ingredients = split_label_sections(extracted_text)

        # Analyze the nutrition info and ingredients
        nutrition_info = analyze_nutritional_info(nutrition_text)
        final_ingredients = cleaned_ingredients  # No nested splitting needed for now
        ingredient_analysis = analyze_ingredients(final_ingredients)

        # Combine results into a response
        response = make_response(
            jsonify({
                "message": "File uploaded successfully",
                "nutrition_info": nutrition_info,
                "final_ingredients": final_ingredients,
                "analysis": ingredient_analysis,
            }), 200
        )
        response.headers["Access-Control-Allow-Origin"] = "*"
        return response

    except Exception as e:
        print(f"Error: {e}")
        return make_response(jsonify({"error": "Internal server error"}), 500)
