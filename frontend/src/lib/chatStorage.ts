import { Message } from "./gemini";

const STORAGE_KEY = "artist_bazaar_ai_chat_v1";
const EXPIRATION_MS = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export interface StoredChatData {
  timestamp: number;
  messages: Message[];
}

/**
 * Loads messages from localStorage if not expired (within 3 hours).
 * Returns fallback default welcome message if expired or empty.
 */
export const loadChatHistory = (defaultWelcome: string): Message[] => {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [{ role: "model", content: defaultWelcome }];
    }

    const parsed: StoredChatData = JSON.parse(rawData);
    const now = Date.now();

    // Check if within 3 hours
    if (parsed.timestamp && now - parsed.timestamp < EXPIRATION_MS && Array.isArray(parsed.messages) && parsed.messages.length > 0) {
      return parsed.messages;
    } else {
      // Expired: clear storage
      localStorage.removeItem(STORAGE_KEY);
      return [{ role: "model", content: defaultWelcome }];
    }
  } catch (error) {
    console.error("Failed to load chat history:", error);
    return [{ role: "model", content: defaultWelcome }];
  }
};

/**
 * Saves chat messages to localStorage with current timestamp.
 */
export const saveChatHistory = (messages: Message[]) => {
  try {
    const data: StoredChatData = {
      timestamp: Date.now(),
      messages,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save chat history:", error);
  }
};

/**
 * Clears stored chat history.
 */
export const clearChatHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to clear chat history:", error);
  }
};
