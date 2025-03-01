import re

def detect_whey_blend(ingredients):
    """
    Detects if a whey protein supplement contains an undisclosed protein blend.
    Returns True if a blend is found, False otherwise.
    """
    blend_keywords = ["blend", "matrix", "complex", "mix", "formula"]
    
    for ingredient in ingredients:
        if any(keyword in ingredient.lower() for keyword in blend_keywords):
            print(f"⚠️ Blend detected in: {ingredient}")
            return True
    
    return False


def calculate_quality_score(ingredients, high_quality_ingredients, neutral_ingredients, filler_ingredients, artificial_ingredients, blend_detected):
    """
    Evaluates the whey protein supplement quality based on ingredients.
    Now includes a detection penalty for whey protein blends.
    """

    # Updated scoring weights
    scoring = {
        "high_quality": 4,
        "neutral": 0,
        "fillers": -1,
        "artificial": -2,
        "unknown": -1,
        "blend_penalty": -4  # NEW: Penalty for protein blends
    }

    # Start with a neutral baseline score
    total_score = 10
    categorized = {"high_quality": [], "neutral": [], "fillers": [], "artificial": [], "unknown": []}

    # Categorize and score ingredients
    for ingredient in ingredients:
        ingredient_lower = ingredient.lower().strip()

        if ingredient_lower in high_quality_ingredients:
            total_score += scoring["high_quality"]
            categorized["high_quality"].append(ingredient)
        elif ingredient_lower in neutral_ingredients:
            total_score += scoring["neutral"]
            categorized["neutral"].append(ingredient)
        elif ingredient_lower in filler_ingredients:
            total_score += scoring["fillers"]
            categorized["fillers"].append(ingredient)
        elif ingredient_lower in artificial_ingredients:
            total_score += scoring["artificial"]
            categorized["artificial"].append(ingredient)
        else:
            total_score += scoring["unknown"]
            categorized["unknown"].append(ingredient)

    # **NEW:** Apply protein blend penalty
    if blend_detected:
        total_score += scoring["blend_penalty"]
        print("⚠️ Detected Whey Protein Blend! Applying Penalty.")

    # Ensure score stays within reasonable bounds
    total_score = max(0, total_score)

    # Adjusted Quality Label Thresholds
    if total_score >= 20:
        quality_label = "Excellent"
    elif 12 <= total_score < 20:
        quality_label = "Good"
    elif 5 <= total_score < 12:
        quality_label = "Average"
    else:
        quality_label = "Poor"

    return {
        "score": total_score,
        "quality_label": quality_label,
        "categorized": categorized
    }
