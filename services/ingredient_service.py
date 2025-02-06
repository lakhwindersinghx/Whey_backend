from database import connect_to_mysql
from utils.scoring import calculate_quality_score, detect_whey_blend

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

        with conn.cursor(dictionary=True) as cursor:
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

        # Detect whey protein blend and calculate quality score
        blend_detected = detect_whey_blend(ingredients)
        quality_result = calculate_quality_score(
            response["high_quality"],
            response["neutral"],
            response["fillers"],
            response["artificial"],
            response["unknown"],
            blend_detected
        )

        # Store results in response
        response["score"] = quality_result["score"]
        response["quality_label"] = quality_result["quality_label"]
        response["blend_detected"] = blend_detected

        conn.close()
        print("✅ Database connection closed.")

        return response

    except Exception as e:
        print(f"❌ Error in analyze_ingredients: {e}")
        raise
