import readline from "readline"

const rl=readline.createInterface({
    input:process.stdin,
    output:process.stdout
});

function  askInput(question){
    return new Promise((resolve)=>{
        rl.question(question, resolve)
    });
}

export default askInput