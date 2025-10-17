projects = [
    {"name": "Web Portfolio Builder", "tags": ["web", "frontend", "portfolio"]},
    {"name": "AI Chatbot", "tags": ["ai", "nlp", "python"]},
    {"name": "Task Tracker App", "tags": ["web", "backend", "productivity"]},
    {"name": "Recommendation System", "tags": ["ai", "ml", "python"]},
    {"name": "Blog Platform", "tags": ["web", "fullstack"]},
]

def recommend_projects(user_interests):
    """
    Recommend projects based on user's interests.
    Args:
        user_interests (list of str): Tags representing user's interests
    Returns:
        List of recommended project names
    """
    recommendations = []
    for project in projects:
        if any(tag in user_interests for tag in project["tags"]):
            recommendations.append(project["name"])
    return recommendations

if __name__ == "__main__":
    print("Welcome to Project Recommender! 🎯")
    interests = input("Enter your interests (comma-separated, e.g., web, ai): ")
    interests_list = [i.strip().lower() for i in interests.split(",")]
    recommended = recommend_projects(interests_list)
    
    if recommended:
        print("\nRecommended Projects for You:")
        for proj in recommended:
            print(f" - {proj}")
    else:
        print("No matching projects found. Try exploring new interests!")
