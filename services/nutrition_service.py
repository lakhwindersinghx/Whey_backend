import re

def analyze_nutritional_info(nutrition_text):
    """Enhanced parsing of nutrition facts."""
    nutrition_info = {
        "calories": None,
        "protein_per_serving": None,
        "servings_per_container": None,
        "fiber_per_serving": None,
        "fat_per_serving": None,
        "carbs_per_serving": None
    }

    try:
        # Flexible numeric pattern to match whole or decimal numbers
        numeric_pattern = r"(\d+(\.\d+)?)"

        # Capture Calories
        calories_match = re.search(r"Calories\s+" + numeric_pattern, nutrition_text, re.IGNORECASE)
        if calories_match:
            nutrition_info["calories"] = float(calories_match.group(1))

        # Capture Protein per Serving
        protein_match = re.search(r"Protein\s+" + numeric_pattern + r"\s*g", nutrition_text, re.IGNORECASE)
        if protein_match:
            nutrition_info["protein_per_serving"] = float(protein_match.group(1))

        # Flexible matching for Total Carbohydrate
        carb_match = re.search(r"Total\s*Carb\w*\s*" + numeric_pattern + r"\s*g", nutrition_text, re.IGNORECASE)
        if carb_match:
            nutrition_info["carbs_per_serving"] = float(carb_match.group(1))


        # Flexible matching for fiber
        fiber_match = re.search(r"Fiber\s*" + numeric_pattern + r"\s*g", nutrition_text, re.IGNORECASE)
        if fiber_match:
            nutrition_info["fiber_per_serving"] = float(fiber_match.group(1))

        # Flexible matching for Total fat
        fat_match = re.search(r"Total\s*Fat\s*" + numeric_pattern + r"\s*g", nutrition_text, re.IGNORECASE)
        if fat_match:
            nutrition_info["fat_per_serving"] = float(fat_match.group(1))

        # Capture Servings per Container
        servings_match = re.search(r"Servings Per Container\s*" + numeric_pattern, nutrition_text, re.IGNORECASE)
        if servings_match:
            nutrition_info["servings_per_container"] = int(float(servings_match.group(1)))

    except Exception as e:
        print(f"Error parsing nutrition info: {e}")

    print("OCR Output:", nutrition_text)
    return nutrition_info
