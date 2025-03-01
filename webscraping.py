import requests
from bs4 import BeautifulSoup
from database import connect_to_mysql  # Importing connect_to_mysql from database.py

# Function to check if an ingredient already exists in the database
def ingredient_exists(cursor, ingredient):
    query = "SELECT id FROM ingredients WHERE ingredient = %s"
    cursor.execute(query, (ingredient,))
    return cursor.fetchone() is not None

# Function to add a new ingredient to the database
def add_ingredient_to_database(cursor, ingredient):
    query = """
    INSERT INTO ingredients (ingredient, category, impact, notes)
    VALUES (%s, %s, %s, %s)
    """
    default_category = "unknown"
    default_impact = "Unknown impact"
    default_notes = "Added dynamically from scraping"
    cursor.execute(query, (ingredient, default_category, default_impact, default_notes))

# Function to extract ingredients and nutritional details from product pages
def extract_product_details(product_link):
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    try:
        response = requests.get(product_link, headers=headers)
        if response.status_code != 200:
            print(f"Failed to fetch {product_link}: Status {response.status_code}")
            return None

        # Parse product page
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract ingredients
        ingredient_section = soup.find('td', class_='seq_span label_ing_2')
        if ingredient_section:
            ingredients = ingredient_section.get_text(separator=", ").strip().split(", ")
            print(f"Ingredients Found: {ingredients}")
        else:
            ingredients = []
            print(f"No ingredients found on {product_link}")

        # Extract nutritional info
        nutrition_table = soup.find('table', id='facts_table')
        nutrition_info = {}
        if nutrition_table:
            for row in nutrition_table.find_all('tr'):
                cells = row.find_all('td')
                if len(cells) == 2:
                    label = cells[0].get_text(strip=True)
                    value = cells[1].get_text(strip=True)
                    nutrition_info[label] = value
            print(f"Nutritional Info Found: {nutrition_info}")
        else:
            print(f"No nutritional information table found on {product_link}")

        return {"ingredients": ingredients, "nutrition": nutrition_info}

    except Exception as e:
        print(f"Error processing {product_link}: {e}")
        return None

# Function to process ingredients and add them to the database
def process_ingredients(ingredients):
    conn = connect_to_mysql()  # Importing and using connect_to_mysql
    if not conn:
        print("Failed to connect to the database.")
        return

    try:
        with conn.cursor() as cursor:
            for ingredient in ingredients:
                print(f"Processing ingredient: {ingredient}")
                if ingredient_exists(cursor, ingredient):
                    print(f"Ingredient '{ingredient}' already exists. Skipping.")
                else:
                    add_ingredient_to_database(cursor, ingredient)
                    print(f"Added ingredient '{ingredient}' to the database.")
            conn.commit()
    except Exception as e:
        print(f"Error processing ingredients: {e}")
    finally:
        conn.close()
        print("Database connection closed.")

# Main script to fetch product links, parse details, and update the database
if __name__ == "__main__":
    # URL for the product category page
    url = "https://shop.bodybuilding.com/collections/whey-protein-blend"
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    }

    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        print("Successfully fetched the webpage!")
        soup = BeautifulSoup(response.text, "html.parser")

        # Extract product links
        product_links = [
            "https://shop.bodybuilding.com" + a_tag['href']
            for a_tag in soup.find_all('a', class_='product-link')
        ]

        total_number_links = len(product_links)
        print(f"Total Number of Product Links Found: {total_number_links}")
        print("Product Links Found:")
        for link in product_links:
            print(link)


        print("\nExtracting details from products and updating database...")
        for product in product_links:
            print(f"\nProcessing product: {product}")
            details = extract_product_details(product)
            if details and details["ingredients"]:
                process_ingredients(details["ingredients"])
    else:
        print(f"Failed to fetch the page. Status code: {response.status_code}")
