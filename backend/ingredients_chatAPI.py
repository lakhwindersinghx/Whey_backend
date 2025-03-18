import openai
import pymysql
from time import sleep  # To prevent hitting rate limits
from database import connect_to_mysql

# Set up OpenAI API Key
openai.api_key =  {{ secrets.API_KEY }}
# Generate concise prompts
def generate_prompt(ingredient):
    return f"""
    Provide concise and detailed information for the following ingredient:
    - Ingredient: {ingredient}
    - Category (e.g., High Quality, Filler, Sweetener, etc.): 
    - Impact (short description, e.g., positive, neutral, or negative impact on health): 
    - Notes (one sentence description of the ingredient):
    """

# Get AI response
def get_ai_response(ingredient):
    prompt = generate_prompt(ingredient)
    try:
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "system", "content": prompt}],
            max_tokens=100,
            temperature=0.7
        )
        return response['choices'][0]['message']['content'].strip()
    except Exception as e:
        print(f"Error with AI for ingredient '{ingredient}': {e}")
        return None

# Parse AI response
def parse_ai_response(ai_response):
    lines = ai_response.split("\n")
    category, impact, notes = "Unknown", "Unknown", "No notes provided"
    for line in lines:
        if "Category" in line:
            category = line.split(":", 1)[1].strip() if ":" in line else "Unknown"
        elif "Impact" in line:
            impact = line.split(":", 1)[1].strip() if ":" in line else "Unknown"
        elif "Notes" in line:
            notes = line.split(":", 1)[1].strip() if ":" in line else "No notes provided"
    return category, impact, notes


# Save to MySQL
def save_to_database(connection, ingredient, category, impact, notes):
    try:
        with connection.cursor() as cursor:
            query = """
                UPDATE ingredients
                SET category = %s, impact = %s, notes = %s
                WHERE ingredient = %s
            """
            cursor.execute(query, (category, impact, notes, ingredient))
        connection.commit()
        print(f"Updated database for ingredient: {ingredient}")
    except Exception as e:
        print(f"Failed to update database for ingredient '{ingredient}': {e}")  


# Main function
def process_ingredients():
    connection = connect_to_mysql()
    if not connection:
        return

    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT ingredient FROM ingredients WHERE category='unknown'")
            ingredients = [row['ingredient'] for row in cursor.fetchall()]

        print(f"Processing {len(ingredients)} ingredients...")
        for ingredient in ingredients:
            print(f"Processing ingredient: {ingredient}")
            ai_response = get_ai_response(ingredient)
            if not ai_response:
                print(f"No data found for ingredient: {ingredient}")
                continue

            print(f"AI Response for '{ingredient}': {ai_response}")
            category, impact, notes = parse_ai_response(ai_response)
            
            save_to_database(connection, ingredient, category, impact, notes)
            sleep(1)  # Avoid rate limiting

    except Exception as e:
        print(f"Error during processing: {e}")
    finally:
        connection.close()
        print("Database connection closed.")

# Run script
if __name__ == "__main__":
    process_ingredients()
