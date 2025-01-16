def calculate_quality_score(ingredients, high_quality_ingredients, neutral_ingredients, filler_ingredients, artificial_ingredients):
    # Scoring rules
    scoring = {
        "high_quality": 3,
        "neutral": 0,
        "fillers": -2,
        "artificial": -1,
        "unknown": 0  # Default to 0 for unknown ingredients
    }

    # Initialize score and categories
    total_score = 0
    categorized = {"high_quality": [], "neutral": [], "fillers": [], "artificial": [], "unknown": []}

    # Categorize and score ingredients
    for ingredient in ingredients:
        if ingredient in high_quality_ingredients:
            total_score += scoring["high_quality"]
            categorized["high_quality"].append(ingredient)
        elif ingredient in neutral_ingredients:
            total_score += scoring["neutral"]
            categorized["neutral"].append(ingredient)
        elif ingredient in filler_ingredients:
            total_score += scoring["fillers"]
            categorized["fillers"].append(ingredient)
        elif ingredient in artificial_ingredients:
            total_score += scoring["artificial"]
            categorized["artificial"].append(ingredient)
        else:
            total_score += scoring["unknown"]
            categorized["unknown"].append(ingredient)

    # Determine quality label
    if total_score >= 8:
        quality_label = "Excellent"
    elif 4 <= total_score < 8:
        quality_label = "Good"
    elif 0 <= total_score < 4:
        quality_label = "Average"
    else:
        quality_label = "Poor"

    return {
        "score": total_score,
        "quality_label": quality_label,
        "categorized": categorized
    }
