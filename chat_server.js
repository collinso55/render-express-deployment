import express from "express";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ IMPORTANT: Use Render's PORT
const PORT = process.env.PORT || 3000;

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini
const genAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// ✅ ROOT ROUTE (fixes "Cannot GET /")
app.get("/", (req, res) => {
  res.json({
    status: "OK",
    message: "Chat API is live 🚀",
    endpoints: {
      chat: "POST /chat",
    },
  });
});


// CHAT ROUTE
app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    console.log("Received message:", message);

    const chat = genAI.chats.create({
      model: "gemini-2.5-flash",
    });

    const result = await chat.sendMessage({ message });
    const aiResponse = result.text;

    console.log("AI Response:", aiResponse);

    const { data, error } = await supabase
      .from("chats")
      .insert([
        {
          user_message: message,
          ai_response: aiResponse,
        },
      ])
      .select();

    if (error) {
      throw new Error("Supabase error: " + error.message);
    }

    return res.json({
      response: aiResponse,
      saved_chat: data[0],
    });

  } catch (error) {
    console.error("Error:", error.message);

    // Fallback for quota / rate limits
    if (
      error.message.includes("429") ||
      error.message.includes("RESOURCE_EXHAUSTED") ||
      error.message.includes("Quota exceeded")
    ) {
      const fallbackResponse =
        "I'm currently experiencing high traffic. Please try again later.";

      const { data, dbError } = await supabase
        .from("chats")
        .insert([
          {
            user_message: message,
            ai_response: fallbackResponse,
          },
        ])
        .select();

      if (dbError) {
        return res.status(500).json({ error: dbError.message });
      }

      return res.json({
        response: fallbackResponse,
        saved_chat: data[0],
      });
    }

    return res.status(500).json({ error: error.message });
  }
});


// START SERVER
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
