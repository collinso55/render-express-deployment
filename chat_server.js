import express from "express";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3000;

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Initialize Gemini
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

app.post("/chat", async (req, res) => {
    const { message } = req.body;
    try {
        if (!message) {
            return res.status(400).json({ error: "Message is required" });
        }

        console.log("Received message:", message);

        // Generate AI response
        const chat = genAI.chats.create({
            model: 'gemini-2.5-flash',
        });

        const result = await chat.sendMessage({ message: message });
        const aiResponse = result.text;

        console.log("AI Response:", aiResponse);

        // Store in Supabase
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
            console.error("Supabase error:", error);
            throw new Error("Failed to save chat to database: " + error.message);
        }

        return res.json({
            response: aiResponse,
            saved_chat: data[0],
        });

    } catch (error) {
        console.error("Error processing chat:", error);

        // Check for rate limit or quota exceeded
        if (error.message && (error.message.includes("429") || error.message.includes("RESOURCE_EXHAUSTED") || error.message.includes("Quota exceeded"))) {
            console.log("Quota exceeded, using fallback response.");
            const fallbackResponse = "I'm currently experiencing high traffic. Please try again later. (Fallback response)";

            // Store fallback in Supabase so the flow completes
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
                return res.status(500).json({ error: "Failed to save fallback to database: " + dbError.message });
            }

            return res.json({
                response: fallbackResponse,
                saved_chat: data[0],
            });
        }

        return res.status(500).json({ error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Chat Server running on http://localhost:${PORT}`);
});
