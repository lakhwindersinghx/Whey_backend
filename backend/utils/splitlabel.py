# def split_label_sections(extracted_text):
#     """
#     Split the extracted text into nutritional info and ingredients sections.
#     """
#     nutrition_keywords = ["calories", "total fat", "sodium", "protein", "cholesterol", "fiber", "sugars", "iron", "potassium", "calcium"]
#     ingredients_keywords = ["ingredients", "contains", "other ingredients"]

#     nutrition_text = ""
#     ingredients_text = ""

#     lines = extracted_text.lower().split("\n")
#     for line in lines:
#         if any(keyword in line for keyword in nutrition_keywords):
#             nutrition_text += line + "\n"
#         elif any(keyword in line for keyword in ingredients_keywords):
#             ingredients_text += line + "\n"

#     return nutrition_text.strip(), ingredients_text.strip()
def split_label_sections(extracted_text):
    """
    Split the extracted text into nutritional info and ingredients sections
    based on known keywords.
    """
    # Expanded keyword lists
    nutrition_keywords = [
        "calories", "total fat", "sodium", "protein", "cholesterol",
        "fiber", "sugars", "iron", "potassium", "calcium",
        "trans fat", "vitamin d", "serving size", "amount per serving"
    ]
    ingredients_keywords = [
        "ingredients", "contains", "other ingredients", "may contain"
    ]

    nutrition_text = ""
    ingredients_text = ""

    lines = extracted_text.lower().split("\n")
    for line in lines:
        line = line.strip()
        if any(keyword in line for keyword in nutrition_keywords):
            nutrition_text += line + "\n"
        elif any(keyword in line for keyword in ingredients_keywords):
            ingredients_text += line + "\n"

    return nutrition_text.strip(), ingredients_text.strip()
