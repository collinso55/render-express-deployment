// getting your key from the .env file
import "dotenv/config";

// importing the gemini model
import { GoogleGenAI } from "@google/genai";

// import readline to take terminal input
import readline from "readline";

// initialize llm
const llm = new GoogleGenAI({});

// setup terminal input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// write a function to use this llm
async function run() {
  rl.question("Type your prompt: ", async function (userPrompt) {
    // function is async because we are going to make an api call
    try {
      const response = await llm.models.generateContent({
        model: "gemini-2.5-flash",
        contents: userPrompt, // <--- use the typed prompt
      });

      console.log("Response from Gemini model:\n");
      console.log(response);
      console.log("\nResponse text:\n");
      console.log(response.text);
    } catch (error) {
      console.error("Error:", error);
    }

    rl.close();
  });
}

run();