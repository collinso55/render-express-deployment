
// const rl=readline.createInterface({
//     input:process.stdin,
//     output:process.stdout
// })

// rl.question("what is the capital of kenya", (answer)=>{
//     console.log("the capital of kenya is:", answer)
// })


// function  input(question){
//     return new Promise((resolve)=>{
//         rl.question(question, resolve)
//     })
// }

// const answer=await input("whats your name? ")
// console.log("your name is", answer)


import "dotenv/config";
import { GoogleGenAI } from "@google/genai";
import readline from "readline"
import askInput from "./utility.js"

const ai=new GoogleGenAI({})


async function main(){
    const chat=ai.chats.create({
        model: 'gemini-2.5-flash',
        history: [
            {
                role: "user",
                parts:[{ text: "hello"}],
            },
            {
                role: "model",
                part: [
                    {
                        text: "great to met you what would you like to know"
                    }
                ]
            }
        ]
    })


    //the chat loop
while(true){
    const userInput=(await askInput("you: ")).trim()
    if(["stop", "bye", "quit", "end"].includes(userInput.toLowerCase())){
        console.log("chat stopped 🤖");
        break;
    }

    console.log("thinking.....")
    try{
        const response=await chat.sendMessage({message:userInput})
        console.log("Ai response 👉 :", response.text)
    }
    catch(error){
        console.log("error occured", error)
    }
}
}
await main()