import { GoogleGenerativeAI } from "@google/generative-ai";

export const handleChat = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback for when the user hasn't set up the API key yet
      return res.status(200).json({
        response: "Hello! I am the SliitCareConnect Assistant. It looks like the Gemini API Key hasn't been set up yet in the backend `.env` file. Please set it up so I can answer your questions properly!",
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // We can provide some system context by prepending to the user's prompt or using system instructions if supported by this model initialization.
    const prompt = `You are the SliitCareConnect Assistant, an AI chatbot for a student counseling platform. Be helpful, concise, and friendly. Answer the following user message:
    User: "${message}"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ error: "Failed to generate AI response." });
  }
};
