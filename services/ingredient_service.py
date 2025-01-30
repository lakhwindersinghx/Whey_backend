from database import connect_to_mysql
from utils.scoring import calculate_quality_score,detect_whey_blend


# def add_ingredient_to_database(ingredient):
#     try:
#         conn = connect_to_mysql()
#         if conn is None:
#             print("Failed to connect to the database.")
#             return False

#         with conn.cursor() as cursor:
#             # Insert ingredient with default values
#             cursor.execute(
#                 """
#                 INSERT INTO ingredients (ingredient, category, impact, notes)
#                 VALUES (%s, %s, %s, %s)
#                 """,
#                 (ingredient, "unknown", "Unknown impact", "Added dynamically")
#             )
#             conn.commit()
#             print(f"Ingredient '{ingredient}' added to the database with default values.")
#         conn.close()
#         return True
#     except Exception as e:
#         print(f"Error while adding ingredient '{ingredient}': {e}")
#         return False


def analyze_ingredients(ingredients):
    """
    Analyzes the list of ingredients, classifies them based on the database, and calculates a quality score.
    """
    try:
        # Initialize response categories
        response = {
            "high_quality": [],
            "fillers": [],
            "artificial": [],
            "neutral": [],
            "unknown": []
        }

        print("🔄 Connecting to database...")
        conn = connect_to_mysql()
        if conn is None:
            print("❌ Failed to connect to the database.")
            raise Exception("Database connection failed.")

        with conn.cursor() as cursor:
            print("✅ Database connection established.")

            for ingredient in ingredients:
                print(f"🔍 Processing ingredient: {ingredient}")

                # Query the database for ingredient classification
                cursor.execute(
                    "SELECT importance, impact, notes FROM ingredients WHERE ingredient = %s",
                    (ingredient,)
                )
                result = cursor.fetchone()

                if result:
                    importance = result["importance"].upper()
                    print(f"✅ Found '{ingredient}' in database with importance: {importance}")

                    if importance == "HIGH QUALITY":
                        response["high_quality"].append(ingredient)
                    elif importance == "FILLER":
                        response["fillers"].append(ingredient)
                    elif importance == "ARTIFICIAL":
                        response["artificial"].append(ingredient)
                    elif importance == "NEUTRAL":
                        response["neutral"].append(ingredient)
                    else:
                        response["unknown"].append(ingredient)
                else:
                    print(f"⚠️ Ingredient '{ingredient}' not found in database.")
                    response["unknown"].append(ingredient)
                    # add_ingredient_to_database(ingredient)  # Add missing ingredient for future use

        # **NEW**: Check if the supplement contains a protein blend
        blend_detected = detect_whey_blend(ingredients)

        # **NEW**: Calculate quality score using improved scoring logic
        print("🔢 Calculating quality score...")
        quality_result = calculate_quality_score(
            response["high_quality"],
            response["neutral"],
            response["fillers"],
            response["artificial"],
            response["unknown"],
            blend_detected  # NEW: Pass blend detection flag to scoring function
        )

        # Store results in response
        response["score"] = quality_result["score"]
        response["quality_label"] = quality_result["quality_label"]
        response["blend_detected"] = blend_detected  # NEW: Show blend detection status

        conn.close()
        print("✅ Database connection closed.")

        return response

    except Exception as e:
        print(f"❌ Error in analyze_ingredients: {e}")
        raise