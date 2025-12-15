import "dotenv/config";
import { GoogleGenAI } from "@google/genai";

const llm = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function listModels() {
  try {
    const models = await llm.models.listModels;
    console.log("Available models:", models);
  } catch (err) {
    console.error("Error listing models:", err);
  }
}

listModels();
