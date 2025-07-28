# Film Review Sentiment Analyzer

This is a simple sentiment analyzer for film reviews using the VADER tool from the Natural Language Toolkit (NLTK). It is designed to help beginners understand how basic sentiment analysis works using Python and NLTK.

## Features

- Analyze sentiment of film reviews using NLTK's VADER
- Interactive CLI mode for manual input
- File-based mode for analyzing multiple reviews at once
- Output includes sentiment label (Positive, Neutral, Negative) and detailed sentiment scores

## Requirements

- Python 3.6+
- NLTK

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/your-org-name/film-sentiment-analyzer-nltk.git
   cd film-sentiment-analyzer-nltk
   ```

2. Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3. Install dependencies:
    ```bash
    pip install -r requirements.txt
    
    ```
4. Download the VADER lexicon (only needs to be done once):
    ```bash
    # nltk_setup.py
    import nltk
    nltk.download('vader_lexicon')
    ```

Run:
    ```bash
    python3 nltk_setup.py
    ```
## Usage

### Interactive Mode
Run the script and enter a review directly:

    ```bash
    python3 analyzer.py
    ```
Example:

    ```bash
    Welcome to the Film Review Sentiment Analyzer
    Type your review below (or type 'exit' to quit):

    Your review: The story was interesting and well-acted.
    Sentiment: Positive
    Scores: {'neg': 0.0, 'neu': 0.51, 'pos': 0.49, 'compound': 0.802}
    ```

### File Mode
    Create a plain text file (e.g. reviews.txt) with one review per line:

    ```bash
    Great visuals and acting.
    Too slow and boring.
    An okay film with some good parts.
    ```