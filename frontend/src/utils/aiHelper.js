// Simple rule-based parser that acts as our AI Triage Model
// In a full application, this would fetch from an LLM API (e.g. OpenAI / Anthropic)
// This showcases AI integration logic, matching the Datastraw AI + Tech Intern JD

export const analyzeTicketAI = (subject = '', description = '') => {
  const text = `${subject.toLowerCase()} ${description.toLowerCase()}`;

  // 1. Determine Sentiment
  let sentiment = 'Neutral';
  const negativeWords = ['angry', 'bad', 'refund', 'waste', 'broken', 'scam', 'terrible', 'worst', 'disappointed', 'failed', 'issue', 'wrong', 'delay', 'late', 'frustrated', 'waiting', 'never', 'cancel', 'charge'];
  const positiveWords = ['thank', 'great', 'awesome', 'good', 'happy', 'love', 'perfect', 'solved', 'helpful', 'amazing'];

  let negCount = 0;
  let posCount = 0;

  negativeWords.forEach(word => {
    if (text.includes(word)) negCount++;
  });

  positiveWords.forEach(word => {
    if (text.includes(word)) posCount++;
  });

  if (negCount > posCount) {
    sentiment = 'Negative';
  } else if (posCount > negCount) {
    sentiment = 'Positive';
  }

  // 2. Determine E-commerce Category
  let category = 'General';
  
  const categories = {
    'Refund': ['refund', 'money back', 'charge', 'card', 'price', 'billing', 'invoice', 'paid', 'double charge'],
    'Shipping': ['shipping', 'delivery', 'tracking', 'delivered', 'courier', 'transit', 'post', 'package', 'address', 'arrive', 'delay'],
    'Product Defect': ['broken', 'damaged', 'defective', 'faulty', 'tore', 'size', 'quality', 'missing item', 'incorrect item'],
    'Account & Tech': ['login', 'account', 'password', 'email', 'sign in', 'verification', 'otp', 'technical', 'bug', 'error', 'reset']
  };

  for (const [catName, keywords] of Object.entries(categories)) {
    const matched = keywords.some(keyword => text.includes(keyword));
    if (matched) {
      category = catName;
      break;
    }
  }

  return { sentiment, category };
};
