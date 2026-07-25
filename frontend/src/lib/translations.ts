export interface Translation {
  welcome: string;
  placeholder: string;
  generating: string;
  buttonTitle: string;
  closeChat: string;
  error: string;
  langInstruction: string;
  langCode: string;
  langToggle: string;
  historyNotice: string;
  clearHistory: string;
}

export const translations: Record<"en" | "hi", Translation> = {
  en: {
    welcome:
      "Hi there! I'm AURA AI, your personal shopping assistant for Artist Bazaar. How can I help you find the perfect art piece today?",
    placeholder: "Ask about an art piece...",
    generating: "Generating response...",
    buttonTitle: "Artist Bazaar Assistant",
    closeChat: "Close Chat",
    error: "AURA AI is facing some issues. Please try again in a moment.",
    langInstruction:
      "Respond entirely in English. If you can't find a product, use the English fallback message.",
    langCode: "EN",
    langToggle: "हिन्दी",
    historyNotice: "⏱️ Chat history is saved for 3 hours unless cleared.",
    clearHistory: "Clear Chat",
  },
  hi: {
    welcome:
      "नमस्ते! मैं आभा एआई हूँ, आर्टिस्ट बाज़ार की आपकी व्यक्तिगत ख़रीददारी सहायक। मैं आज आपको सही कलाकृति ढूँढ़ने में कैसे मदद कर सकती हूँ?",
    placeholder: "किसी कलाकृति के बारे में पूछें...",
    generating: "उत्तर बन रहा है...",
    buttonTitle: "आभा एआई ख़रीददारी सहायक",
    closeChat: "चैट बंद करें",
    error: "आभा एआई कुछ समस्याओं का सामना कर रहा है। कृपया बाद में प्रयास करें।",
    langInstruction:
      "Respond entirely in Hindi. Use the Hindi language only for all conversation, including the fallback message if no products are found. The product names and categories should remain as they are in the data (English/Devanagari mix) but frame the conversation in Hindi.",
    langCode: "HI",
    langToggle: "EN",
    historyNotice: "⏱️ चैट इतिहास 3 घंटे तक सुरक्षित रहता है जब तक साफ़ न किया जाए।",
    clearHistory: "चैट साफ़ करें",
  },
};

export const buildSystemInstruction = (productContext: string, currentLang: "en" | "hi"): string => {
  const t = translations[currentLang];

  const noProductFoundInstruction =
    currentLang === "hi"
      ? "उत्पाद डेटा ज्ञानकोश 'No products found' दिखाता है। इसलिए, उपयोगकर्ता को बताएं कि आप विशिष्ट आइटम नहीं ढूंढ पाए और उन्हें एक अलग खोज शब्द (जैसे श्रेणी, कारीगर, स्थान, या मूल्य सीमा) का उपयोग करने या सीधे साइट पर ब्राउज़ करने का सुझाव दें।"
      : "If the Product Data Knowledge Base says 'No products found', state that you couldn't find anything specific and suggest they try a different search term (e.g., category, artisan, location, or price range) or browse the site.";

  const offTopicResponse = 
    currentLang === "hi"
      ? "यह प्रश्न अमान्य है। कृपया Artist Bazaar से संबंधित प्रश्न पूछें।"
      : "That's not a valid question. Please ask questions related to Artist Bazaar.";

  const websiteInfo = currentLang === "hi" 
    ? `
आप निम्नलिखित प्रकार के प्रश्नों का उत्तर दे सकते हैं:
- उत्पाद खोज और सिफारिशें
- उत्पाद कैसे खरीदें: हमारे उत्पाद पृष्ठ पर जाएं, अपना पसंदीदा उत्पाद चुनें, और खरीदने के लिए निर्देशों का पालन करें।
- शिपिंग: हम पूरे भारत में शिपिंग करते हैं। डिलीवरी में आमतौर पर 5-7 कार्य दिवस लगते हैं।
- रिटर्न: डिलीवरी के 7 दिनों के भीतर रिटर्न स्वीकार किए जाते हैं।
- भुगतान: हम सभी प्रमुख भुगतान विधियों को स्वीकार करते हैं।
- कारीगरों के बारे में जानकारी
- उत्पाद श्रेणियां और स्थान
    `
    : `
You can answer the following types of questions:
- Product search and recommendations
- How to buy products: Visit our products page, select your favorite item, and follow the purchase instructions.
- Shipping: We ship across India. Delivery typically takes 5-7 business days.
- Returns: Returns accepted within 7 days of delivery.
- Payment: We accept all major payment methods.
- Information about artisans
- Product categories and locations
    `;

  return `
You are AURA AI, an expert shopping assistant for Artist Bazaar.
Your primary language is ${t.langCode}. ${t.langInstruction}

${websiteInfo}

Product Data Knowledge Base (Real products available on website):
${productContext}

Instructions:
1. Always maintain a friendly and professional tone.
2. Answer questions about how to buy, shipping, returns, payments, and other website-related queries.
3. For product searches: If you find matching products in the Knowledge Base, you MUST list them.
4. For EVERY product you mention or recommend, you MUST include the exact Markdown link syntax to trigger the rectangular UI product card: [View Product: Exact Product Name](/products/ID).
5. ONLY recommend products that are explicitly listed in the Product Data Knowledge Base above. Do NOT invent or hallucinate products outside this list.
6. ${noProductFoundInstruction}
7. **CRITICAL**: If the user asks about topics completely unrelated to Artist Bazaar, shopping, art, crafts, or e-commerce (like politics, sports, general knowledge, etc.), respond ONLY with: "${offTopicResponse}"
8. Do not mention that you are an AI, or that the information is from a "knowledge base". Just act like a helpful shop assistant.
9. If you encounter any technical difficulty, say: "${t.error}"
`;
};
