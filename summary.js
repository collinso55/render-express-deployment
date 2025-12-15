import "dotenv/config";
import express from "express";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

const app = express();
app.use(express.json());
app.use(cors());
const PORT = 3000;

// Initialize Gemini LLM
// The 'GoogleGenAI' constructor automatically looks for the GEMINI_API_KEY
// in your environment variables, as specified by 'import "dotenv/config";'
const llm = new GoogleGenAI({});

// --- Existing Endpoint: Summarization ---
// POST endpoint for summarization
app.post("/summary", async (req, res) => {
  try {
    const { feedback } = req.body;

    if (!feedback) {
      return res.status(400).json({ error: "Missing 'feedback' field" });
    }

    // Generate summary using Gemini AI
    const response = await llm.models.generateContent({
      model: "gemini-2.5-flash",
      contents: Summarize the customer feedback below into less than 100 words:\n\n${feedback},
    });

    // Extract text from response
    const summaryText = response.text;

    res.json({
      message: "feedback summarized successfully",
      success: true,
      originalFeedback: feedback,
      summary: summaryText,
    });
  } catch (error) {
    console.error("GEMINI SUMMARIZATION ERROR:", error);
    res.status(500).json({
      error: error?.message || "Gemini summarization failed",
    });
  }
});

// --- New Endpoint: English Enhancement ---
/**
 * POST endpoint that takes "broken English" and returns "Enhanced English."
 * Request Body: { post: "broken English" }
 * Response Body: { post: "Enhanced English" }
 */
app.post("/enhance-english", async (req, res) => {
  try {
    // Destructure the 'post' field from the request body
    const { post } = req.body;

    if (!post) {
      return res.status(400).json({ error: "Missing 'post' field with the English text to enhance" });
    }

    // 1. Construct the system and user prompts
    // The system instruction guides the model's behavior precisely.
    const systemInstruction = "You are a language enhancement AI. Your task is to correct grammar, improve clarity, and refine the tone of the provided text. Only respond with the corrected and enhanced version of the text. Do not include any preambles, explanations, or quotes.";
    const userMessage = Enhance the following text: ${post};

    // 2. Call the Gemini API with the system instruction
    const response = await llm.models.generateContent({
      model: "gemini-2.5-flash",
      contents: userMessage,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    // 3. Extract the enhanced text
    const enhancedEnglish = response.text.trim();

    // 4. Send the structured response
    res.json({
      message: "English enhanced successfully",
      success: true,
      originalPost: post,
      post: enhancedEnglish, // Matches your desired response format
    });
  } catch (error) {
    console.error("GEMINI ENHANCEMENT ERROR:", error);
    res.status(500).json({
      error: error?.message || "Gemini language enhancement failed",
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(Server running at http://localhost:${PORT});
  console.log(Enhancement Endpoint: POST http://localhost:${PORT}/enhance-english);
});