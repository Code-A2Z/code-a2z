import sys
from nltk.sentiment.vader import SentimentIntensityAnalyzer


def analyze_sentiment(text):
    analyzer = SentimentIntensityAnalyzer()
    scores = analyzer.polarity_scores(text)
    sentiment = get_sentiment_label(scores["compound"])
    return {
        "text": text,
        "scores": scores,
        "sentiment": sentiment
    }


def get_sentiment_label(compound_score):
    if compound_score >= 0.05:
        return "Positive"
    elif compound_score <= -0.05:
        return "Negative"
    else:
        return "Neutral"


def analyze_file(filepath):
    print(f"\n📂 Analyzing file: {filepath}\n")
    try:
        with open(filepath, "r") as file:
            lines = file.readlines()

        for idx, line in enumerate(lines, 1):
            review = line.strip()
            if review:
                result = analyze_sentiment(review)
                print(f"\n🔹 Review {idx}: {result['text']}")
                print(f"Sentiment: {result['sentiment']}")
                print(f"Scores: {result['scores']}")
    except FileNotFoundError:
        print(" File not found. Please check the filename.")


def main():
    if len(sys.argv) > 1:
        analyze_file(sys.argv[1])
    else:
        print("🎬 Welcome to the Film Review Sentiment Analyzer")
        print("Type your review below (or type 'exit' to quit):")

        while True:
            review = input("\nYour review: ").strip()
            if review.lower() == "exit":
                print("Goodbye! 👋")
                sys.exit()

            if not review:
                print("Please enter some text.")
                continue

            result = analyze_sentiment(review)
            print(f"\n Review: {result['text']}")
            print(f"Sentiment: {result['sentiment']}")
            print(f"Scores: {result['scores']}")


if __name__ == "__main__":
    main()