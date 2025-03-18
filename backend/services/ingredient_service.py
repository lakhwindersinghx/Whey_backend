import pymysql
from database import connect_to_mysql
from utils.scoring import calculate_quality_score,detect_whey_blend

def clean_ingredients(ingredient_text):
    """
    Cleans ingredient text and returns a structured list.
    """
    ingredient_text = ingredient_text.replace("Ingredients:", "").replace("Other Ingredients:", "").strip()

    if "(" in ingredient_text and ")" in ingredient_text:
        base, nested = ingredient_text.split("(", 1)
        nested = nested.rstrip(")")
        ingredients = base.split(",") + nested.split(",")
    else:
        ingredients = ingredient_text.split(",")

    return [ing.strip() for ing in ingredients if ing.strip()]

# def fetch_ingredient_details(ingredients):
#     """
#     Queries the database for ingredient information.
#     """
#     try:
#         conn = connect_to_mysql()
#         if conn is None:
#             raise Exception("Database connection failed.")

#         ingredient_details = []
#         with conn.cursor(pymysql.cursors.DictCursor) as cursor:
#             for ingredient in ingredients:
#                 cursor.execute(
#                     "SELECT ingredient, category, impact, notes, importance FROM ingredients WHERE ingredient = %s",
#                     (ingredient,)
#                 )
#                 result = cursor.fetchone()
#                 ingredient_details.append(result if result else {
#                     "ingredient": ingredient,
#                     "category": "Unknown",
#                     "impact": "Not specified",
#                     "notes": "No notes available",
#                     "importance": "Unknown"
#                 })

#         conn.close()
#         return ingredient_details

#     except Exception as e:
#         print(f"Error fetching ingredient details: {e}")
#         return [{"ingredient": ing, "category": "Unknown", "impact": "Not specified", "notes": "No notes available", "importance": "Unknown"} for ing in ingredients]
def fetch_ingredient_details(ingredients):
    """
    Queries the database for ingredient information and preserves importance mapping.
    """
    try:
        conn = connect_to_mysql()
        if conn is None:
            raise Exception("Database connection failed.")

        ingredient_details = []
        with conn.cursor(pymysql.cursors.DictCursor) as cursor:
            for ingredient in ingredients:
                cursor.execute(
                    "SELECT ingredient, category, impact, notes, importance FROM ingredients WHERE ingredient = %s",
                    (ingredient,)
                )
                result = cursor.fetchone()

                if result:
                    ingredient_details.append(result)
                else:
                    # Default to Unknown if not found in DB
                    ingredient_details.append({
                        "ingredient": ingredient,
                        "category": "Unknown",
                        "impact": "Not specified",
                        "importance": "UNKNOWN",
                        "notes": "No notes available"
                    })

        conn.close()
        return ingredient_details

    except Exception as e:
        print(f"Error fetching ingredient details: {e}")
        return [{"ingredient": ing, "category": "Unknown", "impact": "Not specified", "importance": "UNKNOWN", "notes": "No notes available"} for ing in ingredients]

# def analyze_ingredients(ingredient_text):
#     """
#     Extracts, cleans, and retrieves ingredient details from the database.
#     """
#     final_ingredients = clean_ingredients(ingredient_text)
#     ingredient_analysis = fetch_ingredient_details(final_ingredients)
#     return final_ingredients, ingredient_analysis
def analyze_ingredients(ingredient_text):
    """
    Extracts, cleans, and retrieves ingredient details from the database.
    Categorizes ingredients based on "importance" and calculates a score.
    """
    final_ingredients = clean_ingredients(ingredient_text)
    ingredient_details = fetch_ingredient_details(final_ingredients)

    # Detect protein blend before scoring
    blend_detected = detect_whey_blend(final_ingredients)

    # **Map importance values to scoring categories**
    categorized_ingredients = {
        "high_quality": [ing["ingredient"] for ing in ingredient_details if ing["importance"].upper() == "HIGH_QUALITY"],
        "neutral": [ing["ingredient"] for ing in ingredient_details if ing["importance"].upper() == "NEUTRAL"],
        "fillers": [ing["ingredient"] for ing in ingredient_details if ing["importance"].upper() == "FILLER"],
        "artificial": [ing["ingredient"] for ing in ingredient_details if ing["importance"].upper() == "ARTIFICIAL"],
        "unknown": [ing["ingredient"] for ing in ingredient_details if ing["importance"].upper() == "UNKNOWN"]
    }

    # Calculate the quality score using importance-based categories
    analysis_summary = calculate_quality_score(
        final_ingredients,
        categorized_ingredients["high_quality"],
        categorized_ingredients["neutral"],
        categorized_ingredients["fillers"],
        categorized_ingredients["artificial"],
        blend_detected
    )

    return final_ingredients, ingredient_details, analysis_summary
