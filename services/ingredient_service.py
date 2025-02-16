import pymysql
from database import connect_to_mysql

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

def fetch_ingredient_details(ingredients):
    """
    Queries the database for ingredient information.
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
                ingredient_details.append(result if result else {
                    "ingredient": ingredient,
                    "category": "Unknown",
                    "impact": "Not specified",
                    "notes": "No notes available",
                    "importance": "Unknown"
                })

        conn.close()
        return ingredient_details

    except Exception as e:
        print(f"Error fetching ingredient details: {e}")
        return [{"ingredient": ing, "category": "Unknown", "impact": "Not specified", "notes": "No notes available", "importance": "Unknown"} for ing in ingredients]

def analyze_ingredients(ingredient_text):
    """
    Extracts, cleans, and retrieves ingredient details from the database.
    """
    final_ingredients = clean_ingredients(ingredient_text)
    ingredient_analysis = fetch_ingredient_details(final_ingredients)
    return final_ingredients, ingredient_analysis
