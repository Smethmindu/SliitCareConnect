import { GoogleGenerativeAI } from "@google/generative-ai";

const SYSTEM_PROMPT = `You are the SliitCareConnect Assistant — an AI chatbot for a university student counseling platform at SLIIT (Sri Lanka Institute of Information Technology).

Your role:
- Help students navigate the platform: booking appointments, finding counselors, accessing mental health resources, and taking self-assessment quizzes.
- Provide empathetic, supportive, and non-judgmental responses about mental health topics.
- Keep responses concise (2-4 sentences) unless the user asks for detail.
- If a student seems to be in crisis, encourage them to contact a professional counselor immediately through the platform or call a crisis helpline.
- You can suggest platform features like: "Book an Appointment", "Browse Resources", "Take a Self-Assessment Quiz", or "View Counselor Profiles".
- Do NOT provide medical diagnoses or prescribe treatments. Always recommend speaking with a qualified counselor for serious concerns.
- Be warm, friendly, and use occasional emojis to feel approachable.`;

// Model priority list — falls back if the primary model is overloaded
const MODELS = ["gemini-2.5-flash", "gemini-2.0-flash-lite", "gemini-2.0-flash"];

// Reuse a single SDK instance for performance
let genAIInstance = null;

function getGenAI() {
  if (!genAIInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    genAIInstance = new GoogleGenerativeAI(apiKey);
  }
  return genAIInstance;
}

/**
 * Attempt to generate a response, trying fallback models on transient errors.
 */
async function generateWithFallback(genAI, chatHistory, userMessage) {
  let lastError = null;

  for (const modelName of MODELS) {
    try {
      console.log(`Chatbot: trying model "${modelName}"...`);
      const model = genAI.getGenerativeModel({
        model: modelName,
        systemInstruction: SYSTEM_PROMPT,
      });

      const chat = model.startChat({ history: chatHistory });
      const result = await chat.sendMessage(userMessage);
      const text = result.response.text();
      console.log(`Chatbot: success with model "${modelName}"`);
      return text;
    } catch (error) {
      lastError = error;
      const status = error?.status || error?.response?.status;
      console.warn(
        `Chatbot: model "${modelName}" failed (${status || "unknown"}): ${error?.message}`
      );

      // Only fallback on transient errors (503, 429, 500)
      if (status === 503 || status === 429 || status === 500) {
        continue; // try next model
      }
      // Non-transient error — don't bother trying other models
      throw error;
    }
  }

  // All models failed
  throw lastError;
}

export const handleChat = async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "Message is required." });
    }

    const genAI = getGenAI();

    if (!genAI) {
      return res.status(200).json({
        response:
          "Hello! I am the SliitCareConnect Assistant. It looks like the Gemini API Key hasn't been configured yet. Please contact the administrator to set it up so I can answer your questions properly! 🔧",
      });
    }

    // Build conversation history for multi-turn context
    const chatHistory = [];
    if (Array.isArray(history)) {
      for (const msg of history) {
        if (msg.role === "user" && msg.text) {
          chatHistory.push({ role: "user", parts: [{ text: msg.text }] });
        } else if (msg.role === "bot" && msg.text) {
          chatHistory.push({ role: "model", parts: [{ text: msg.text }] });
        }
      }
    }

    const text = await generateWithFallback(
      genAI,
      chatHistory,
      message.trim()
    );

    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Chatbot Error:", error?.message || error);

    // Provide user-friendly error messages based on error type
    const status = error?.status || error?.response?.status;

    if (status === 429 || status === 403 || error?.message?.includes("API key") || error?.message?.includes("API_KEY_INVALID") || error?.message?.includes("PERMISSION_DENIED")) {
      // Reset cached instance so a new/updated key can be picked up on next request
      genAIInstance = null;
      console.error("Chatbot: API key may be invalid or revoked. Please generate a new key at https://aistudio.google.com/apikey");
      return res.status(200).json({
        response:
          "There seems to be an issue with my API configuration. The API key may have been revoked. Please contact the administrator to generate a new key. 🔧",
      });
    }

    res.status(200).json({
      response:
        "I'm sorry, I'm having trouble responding right now. Please try again in a moment or reach out to a counselor directly through the platform. 💙",
    });
  }
};
