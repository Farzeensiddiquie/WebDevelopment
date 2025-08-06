// 8. Coin Toss Simulator
var toss=prompt("Enter 0 for heads or 1 for tails");
if(toss==0) {
    randomNumber = Math.floor(Math.random() * 2);
    if(randomNumber==0){
        console.log("You won");
    }else{
        console.log("You lost");
    }
}else if(toss==1){
    randomNumber = Math.floor(Math.random() * 2);
    if(randomNumber==1){
        console.log("You won");
    }else{
        console.log("You lost");
    }
}else{
    console.log("Invalid Input");
}

