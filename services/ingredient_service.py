from database import connect_to_mysql
from utils.scoring import calculate_quality_score


def add_ingredient_to_database(ingredient):
    try:
        conn = connect_to_mysql()
        if conn is None:
            print("Failed to connect to the database.")
            return False

        with conn.cursor() as cursor:
            # Insert ingredient with default values
            cursor.execute(
                """
                INSERT INTO ingredients (ingredient, category, impact, notes)
                VALUES (%s, %s, %s, %s)
                """,
                (ingredient, "unknown", "Unknown impact", "Added dynamically")
            )
            conn.commit()
            print(f"Ingredient '{ingredient}' added to the database with default values.")
        conn.close()
        return True
    except Exception as e:
        print(f"Error while adding ingredient '{ingredient}': {e}")
        return False


def analyze_ingredients(ingredients):
    try:
        # Initialize response
        response = {
            "high_quality": [],
            "fillers": [],
            "artificial": [],
            "neutral": [],
            "unknown": []
        }

        print("Connecting to database...")
        conn = connect_to_mysql()

        # Handle database connection failure
        if conn is None:
            print("Failed to connect to the database.")
            raise Exception("Database connection failed.")

        # Use a cursor for database operations
        with conn.cursor() as cursor:
            print("Database connection established.")

            for ingredient in ingredients:
                print(f"Processing ingredient: {ingredient}")
                # Query the database
                cursor.execute(
                    "SELECT category, impact, notes FROM ingredients WHERE ingredient = %s",
                    (ingredient,)
                )
                result = cursor.fetchone()

                if result:
                    print(f"Found in database: {result}")
                    # Categorize based on database result
                    category = result["category"].lower()
                    if category in response:
                        response[category].append(ingredient)
                    else:
                        response["neutral"].append(ingredient)
                else:
                    print(f"Not found in database: {ingredient}")
                    # Mark as unknown if the ingredient is not in the database
                    response["unknown"].append(ingredient)
                    # Add the missing ingredient to the database
                    add_ingredient_to_database(ingredient)

        # Add a score based on categories
        print("Calculating quality score...")
        quality_result = calculate_quality_score(
            response["high_quality"],
            response["neutral"],
            response["fillers"],
            response["artificial"],
            response["unknown"],
        )
        
        response["score"] = quality_result["score"]
        response["quality_label"] = quality_result["quality_label"]

        # Close the database connection
        conn.close()
        print("Database connection closed.")

        return response

    except Exception as e:
        print(f"Error in analyze_ingredients: {e}")
        raise
