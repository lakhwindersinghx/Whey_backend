import openai
import pymysql
import re
from time import sleep
from database import connect_to_mysql

# Set up OpenAI API Key
openai.api_key = ""

# Measurement Patterns to Remove
MEASUREMENT_PATTERNS = [
    r"\b\d+mg\b", r"\b\d+g\b", r"\b\d+kg\b", r"\b\d+ml\b", r"\b\d+l\b",
    r"\b\d+oz\b", r"\b\d+iu\b", r"\bserving\b", r"\bscoop\b", r"\bscoops\b",
    r"\b\d+% dv\b", r"\bcontains\b"
]

def is_measurement_entry(ingredient):
    """ Detects if an ingredient name contains measurement-related values """
    for pattern in MEASUREMENT_PATTERNS:
        if re.search(pattern, ingredient.lower()):
            print(f"Removing invalid entry: {ingredient}")
            return True
    return False

def classify_ingredient_with_ai(ingredient):
    """ Uses OpenAI to classify ingredient importance, ensuring it's a valid ingredient. """
    cleaned_ingredient = re.sub(r"[()\.]", "", ingredient).strip()

    # Skip if it's a measurement
    if not cleaned_ingredient or is_measurement_entry(cleaned_ingredient):
        return "REMOVE"

    prompt = f"""
    Given the following whey protein ingredient, classify its importance in a whey protein supplement. 
    Choose one of:
    - HIGH QUALITY (Essential, improves protein content, aids absorption)
    - FILLER (Non-essential, used to add bulk)
    - ARTIFICIAL (Synthetic additives, artificial sweeteners)
    - NEUTRAL (Not essential but not harmful)
    - UNKNOWN (Not enough information)

    Ingredient: {cleaned_ingredient}
    """
    prompt = f"""
    Given the following whey protein ingredient, classify its importance in a whey protein supplement. 
    Choose one of:
    - HIGH QUALITY (Essential, improves protein content, aids absorption)
    - FILLER (Non-essential, used to add bulk)
    - ARTIFICIAL (Synthetic additives, artificial sweeteners)
    - NEUTRAL (Not essential but not harmful)
    - UNKNOWN (Not enough information)

    Ingredient: {cleaned_ingredient}
    """

    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}],
            max_tokens=30,
            temperature=0
        )
        classification = response['choices'][0]['message']['content'].strip().upper()
        valid_categories = ["HIGH QUALITY", "FILLER", "ARTIFICIAL", "NEUTRAL", "UNKNOWN"]
        return classification if classification in valid_categories else "UNKNOWN"

    except Exception as e:
        print(f"AI classification error for '{ingredient}': {e}")
        return "UNKNOWN"

def add_importance_column():
    """ Ensures 'importance' column exists in MySQL """
    connection = connect_to_mysql()
    if not connection:
        print("Failed to connect to database.")
        return

    try:
        with connection.cursor() as cursor:
            cursor.execute("SHOW COLUMNS FROM ingredients LIKE 'importance'")
            if not cursor.fetchone():
                print("Adding 'importance' column...")
                cursor.execute("""
                    ALTER TABLE ingredients ADD COLUMN importance 
                    ENUM('HIGH QUALITY', 'FILLER', 'ARTIFICIAL', 'NEUTRAL', 'UNKNOWN') DEFAULT 'UNKNOWN'
                """)
                connection.commit()
                print("'importance' column added.")

    except Exception as e:
        print(f"Error adding column: {e}")
    finally:
        connection.close()

def classify_ingredients():
    """ Classifies, updates, and removes measurement-based ingredients in the database """
    connection = connect_to_mysql()
    if not connection:
        print("Failed to connect to database.")
        return

    try:
        with connection.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT id, ingredient FROM ingredients WHERE importance='UNKNOWN'")
            ingredients = cursor.fetchall()

            for item in ingredients:
                ingredient_id = item["id"]
                ingredient_name = item["ingredient"]

                # Check and delete measurement entries
                if is_measurement_entry(ingredient_name):
                    print(f"Deleting measurement entry: {ingredient_name}")
                    cursor.execute("DELETE FROM ingredients WHERE id = %s", (ingredient_id,))
                    connection.commit()  # Ensure deletion is saved
                    continue

                # Classify with AI
                classification = classify_ingredient_with_ai(ingredient_name)

                if classification == "REMOVE":
                    print(f"Deleting invalid ingredient: {ingredient_name}")
                    cursor.execute("DELETE FROM ingredients WHERE id = %s", (ingredient_id,))
                    connection.commit()  # Ensure deletion is saved
                    continue

                print(f"Updating: {ingredient_name} → {classification}")

                # Ensure updates are written to database
                cursor.execute("""
                    UPDATE ingredients
                    SET importance = %s
                    WHERE id = %s
                """, (classification, ingredient_id))
                connection.commit()  # Ensure update is saved
                sleep(1)  # Avoid OpenAI rate limits

        print("Ingredient classification updated successfully.")

    except Exception as e:
        print(f"Error updating ingredient importance: {e}")
    finally:
        connection.close()

# Run the classification process
if __name__ == "__main__":
    add_importance_column()
    classify_ingredients()
