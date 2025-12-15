import { GoogleGenAI} from "@google/genai"
const ai=new GoogleGenAI({})
import "dotenv/config"



async function main(){
    const response=await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: "have you ever heard about seedinc?",
        config:{
            thinkingConfig:{
                thinkingBudget:0
            },
            systemInstruction:"you are a helpful assistant that gives concise answers",
            temperature:0.9,
            maxOutputTokens:1024
        }
    })


console.log(response.text)
}

await main()