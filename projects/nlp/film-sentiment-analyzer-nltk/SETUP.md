### Project Setup Guide

Follow the steps below to set up the **Film Sentiment Analyzer** project on your local machine.

---

## 1. Clone the Repository

```bash
git clone https://github.com/Code-A2Z/film-sentiment-analyzer-nltk.git
cd film-sentiment-analyzer-nltk
```

2. Create a virtual environment (optional but recommended):
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows: venv\Scripts\activate
    ```
3. Install dependencies:
    ```bash
    pip install nltk
    
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