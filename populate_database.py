from database import connect_to_database

data = [
    ("Whey Protein Isolate", "High-Quality", "Highly bioavailable, good protein source", "Minimal carbs and fats."),
    ("Grass-Fed Whey Protein", "High-Quality", "Highly bioavailable, nutrient-dense", "Clean protein source."),
    ("Stevia", "Natural Sweetener", "Low-calorie, minimal side effects", "Natural alternative to artificial sweeteners."),
    ("Maltodextrin", "Filler", "May cause bloating, spikes blood sugar", "Often used to bulk up powders."),
    ("Casein Complex", "Filler", "Lower digestibility compared to whey isolate", "Often added to reduce costs."),
    ("Corn Syrup Solids", "Filler", "High in sugar and calories", "Cheap filler ingredient."),
    ("Carrageenan", "Filler", "May cause gastric distress", "Used as a thickener."),
    ("Xanthan Gum", "Filler", "May cause bloating and gas", "Commonly used as a thickener."),
    ("Cellulose Gum", "Filler", "May cause gastric distress", "Used as a stabilizer or thickener."),
    ("Acesulfame Potassium", "Artificial", "May cause gastric distress and headaches", "Artificial sweetener often combined with sucralose."),
    ("Sucralose", "Artificial", "May cause gastric distress in some people", "Artificial sweetener."),
    ("Natural Flavoring", "Neutral", "Adds flavor with minimal risk", "Varies depending on the source."),
    ("Artificial Flavoring", "Artificial", "May contain synthetic chemicals", "Can cause sensitivities in some individuals."),
    ("Calcium Caseinate", "Filler", "Lower digestibility and allergenic potential", "Often added to lower costs."),
    ("Micellar Casein", "Filler", "Slower-digesting protein", "Often used in blends for slower absorption."),
    ("Hydrolyzed Whey Protein", "High-Quality", "Predigested for faster absorption", "Ideal for post-workout recovery."),
    ("Non-Dairy Creamer", "Filler", "May contain hydrogenated oils and trans fats", "Common in low-quality blends."),
    ("Polydextrose", "Filler", "Used as a low-calorie filler", "May cause digestive discomfort in large amounts."),
    ("Silicon Dioxide", "Filler", "Anti-caking agent", "No nutritional value."),
    ("Sunflower Lecithin", "Neutral", "Emulsifier with minimal impact", "Improves mixability."),
    ("Soy Lecithin", "Neutral", "Emulsifier, may be from GMO sources", "Improves texture and mixability."),
    ("Medium Chain Triglycerides (MCT)", "Neutral", "Easily digestible fat source", "Often added for energy and creaminess.")
]

def insert_bulk_data():
    conn = connect_to_database()
    cursor = conn.cursor()

    try:
        query = """
        INSERT INTO ingredients (ingredient, category, impact, notes)
        VALUES (%s, %s, %s, %s)
        ON DUPLICATE KEY UPDATE 
        category = VALUES(category), 
        impact = VALUES(impact), 
        notes = VALUES(notes)
        """
        cursor.executemany(query, data)
        conn.commit()
        print("Data successfully added/updated in the database!")
    except Exception as e:
        print(f"Error inserting data: {e}")
    finally:
        cursor.close()
        conn.close()

if __name__ == "__main__":
    insert_bulk_data()
