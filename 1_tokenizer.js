function seedTokenizer(text){
    //numbers
    const words= text.split(" ")
    console.log("word split", words)

    const token=words.map((word, index)=>{
        const embeddings = word.length*100 + index*Math.random();
        console.log(`word: ${word} - ${embeddings}`);
    })
    return token
}


seedTokenizer("i love the idea of llm generating one word at a time., i am adding more data ")