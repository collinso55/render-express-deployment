import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({});

async function main(){
    const chat = ai.chats.create({
        model: "gemini-2.0-flash",
        history: [
            {
                role: "user",
                parts: [{ text: "hello"}],
            },
            {
                role: "model",
                part:[
                    {
                        text: "great to meet you, what would you like to know?",
                    },
                ],
            },
        ],
    });



    const response1=await chat.sendMessage({
        message: "i have 2dogs in my house "
    })

    const model_response1=response1.text
    console.log("model response 1: ", model_response1)


    const response2=await chat.sendMessage({
        message: "how many paws are in my house__"
    })

    const model_response2=response2.text
    console.log("model response 2: ", model_response2)
}