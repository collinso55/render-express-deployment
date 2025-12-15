import { GoogleGenAI } from "@google/genai"
import 'dotenv/config'


const ai=new GoogleGenAI({});

async function main(){
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "have you ever heard about seedinc?",
        config:{
            thinkingConfig:{
                thinkingBudget:0
            },
            maxOutputTokens:500,
            temperature:0.8
        }
});

for await (const chunk of response){
    console.log(chunk.text);
}
}
await main()