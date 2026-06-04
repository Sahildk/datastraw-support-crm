def analyze_ticket_ai(subject: str = "", description: str = "") -> dict:
    text = f"{subject.lower()} {description.lower()}"

    # 1. Determine Sentiment
    sentiment = "Neutral"
    negative_words = [
        "angry", "bad", "refund", "waste", "broken", "scam", "terrible", "worst", 
        "disappointed", "failed", "issue", "wrong", "delay", "late", "frustrated", 
        "waiting", "never", "cancel", "charge"
    ]
    positive_words = [
        "thank", "great", "awesome", "good", "happy", "love", "perfect", "solved", 
        "helpful", "amazing"
    ]

    neg_count = sum(1 for word in negative_words if word in text)
    pos_count = sum(1 for word in positive_words if word in text)

    if neg_count > pos_count:
        sentiment = "Negative"
    elif pos_count > neg_count:
        sentiment = "Positive"

    # 2. Determine Category
    category = "General"
    categories = {
        "Refund": ["refund", "money back", "charge", "card", "price", "billing", "invoice", "paid", "double charge"],
        "Shipping": ["shipping", "delivery", "tracking", "delivered", "courier", "transit", "post", "package", "address", "arrive", "delay"],
        "Product Defect": ["broken", "damaged", "defective", "faulty", "tore", "size", "quality", "missing item", "incorrect item"],
        "Account & Tech": ["login", "account", "password", "email", "sign in", "verification", "otp", "technical", "bug", "error", "reset"]
    }

    for cat_name, keywords in categories.items():
        if any(keyword in text for keyword in keywords):
            category = cat_name
            break

    return {"sentiment": sentiment, "category": category}
