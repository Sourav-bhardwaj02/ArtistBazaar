// src/utils/geminiClient.ts
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const PRIMARY_MODEL = import.meta.env.VITE_GEMINI_MODEL || "gemini-3-flash-preview";

const CANDIDATE_MODELS = Array.from(
  new Set([PRIMARY_MODEL, "gemini-3-flash-preview", "gemini-2.5-flash", "gemini-2.0-flash"])
);

const MAX_RETRIES = 3;
const INITIAL_DELAY_MS = 500;

export interface Message {
  role: "user" | "model";
  content: string;
}

export interface ChatPayload {
  contents: Array<{
    role: string;
    parts: Array<{ text: string }>;
  }>;
  systemInstruction: {
    parts: Array<{ text: string }>;
  };
}

export const fetchWithRetry = async (
  payload: ChatPayload,
  errorMessage: string,
  maxRetries = MAX_RETRIES,
  delay = INITIAL_DELAY_MS
): Promise<string> => {
  const keysToTry = [GEMINI_API_KEY].filter(Boolean) as string[];

  for (const apiKey of keysToTry) {
    for (const model of CANDIDATE_MODELS) {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

      for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });

          if (response.ok) {
            const result = await response.json();
            const generatedText = result.candidates?.[0]?.content?.parts?.[0]?.text;
            if (generatedText) return generatedText;
          }

          const errorBody = await response.text();
          console.warn(`Model ${model} with key ${apiKey.substring(0, 8)}... failed (${response.status}):`, errorBody);

          // If model not found or quota limit reached, break to try next model immediately
          if (response.status === 404 || response.status === 429) {
            break;
          }
        } catch (error) {
          console.error(`Attempt ${i + 1} for ${model} failed:`, error);
        }

        await new Promise((resolve) => setTimeout(resolve, delay));
        delay *= 1.5;
      }
    }
  }

  throw new Error(errorMessage);
};
