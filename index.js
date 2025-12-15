// 1. Convert all 'require()' to 'import' statements
import express from 'express';

import { GoogleGenAI } from '@google/genai';
import 'dotenv/config'; 

const app = express();
const PORT = 3000;


if (!process.env.GEMINI_API_KEY) {
    console.error("❌ ERROR: GEMINI_API_KEY is not set in your .env file.");
    process.exit(1);
}

// The GoogleGenAI client is initialized without arguments when the API key is in the environment
const ai = new GoogleGenAI({});

// Middleware to parse incoming JSON request bodies (essential for req.body)
app.use(express.json());

// --- The Intelligent Language Enhancement Endpoint ---
// ROUTE: POST http://localhost:3000/enhanced-english
app.post('/enhanced-english', async (req, res) => {
    // 3. Extract the input text from the 'post' key
    const pidginEnglish = req.body.post;
    
    // Input Validation
    if (!pidginEnglish) {
        return res.status(400).json({ 
            success: false,
            error: "Missing 'post' in request body.",
            hint: "Request body should be: { \"post\": \"Your Pidgin English statement...\" }"
        });
    }

    // 4. The Core System Instruction for the LLM
    const systemInstruction = 
        "You are an expert language translator specializing in converting Nigerian Pidgin English to formal, fluent Standard English. Your task is to take the user's input, translate its core meaning accurately, and return the enhanced version as polished, grammatically correct Standard English. Only output the enhanced text, with no extra commentary, prefaces, or explanation.";

    try {
        // 5. Construct and Execute the API Call using Gemini 2.5 Flash
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash", 
            contents: pidginEnglish,
            config: {
                systemInstruction: systemInstruction,
                temperature: 0.1 // Low temperature for highly accurate translation
            }
        });

        // The generated text is accessed via .text
        const enhancedEnglish = response.text.trim();
        
        // 6. Send the successful response with both the original and enhanced text
        res.json({
            success: true,
            message: "Pidgin English successfully enhanced to Standard English", 
            originalPost: pidginEnglish, // Original text copied from the request body
            post: enhancedEnglish // The Enhanced English output
        });

    } catch (error) {
        console.error('Gemini API Error:', error);
        res.status(500).json({ 
            success: false,
            error: "Failed to enhance language via Gemini API.", 
            details: error.message 
        });
    }
});

// --- Server Startup ---
app.listen(PORT, () => {
    console.log(`✅ Server is running on http://localhost:${PORT}`);
    console.log(`Endpoint ready for testing: POST http://localhost:${PORT}/enhanced-english`);
});