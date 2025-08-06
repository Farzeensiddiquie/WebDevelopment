//4.Rock-Paper-Scissors Game
 var Player1choice = prompt("Enter choice of player 1 rock, paper, or scissors");
 var Player2choice = prompt("Enter choice of player 2 rock, paper, or scissors");
if (Player1choice=="rock" && Player2choice=="paper") {
    console.log("Paper beats rock");
    console.log("Player 2 Wins");  
} else if(Player1choice=="paper" && Player2choice=="rock"){
    console.log("Paper beats rock");
    console.log("Player 1 Wins");
} else if(Player1choice=="rock" && Player2choice=="scissors"){
    console.log("rock beats scissors");
    console.log("Player 1 Wins");
}else if(Player1choice=="scissors" && Player2choice=="rock"){
    console.log("rock beats scissors");
    console.log("Player 2 Wins");
}else if(Player1choice=="paper" && Player2choice=="scissors"){
    console.log("scissors beats paper");
    console.log("Player 2 Wins");
}else if(Player1choice=="scissors" && Player2choice=="paper"){
    console.log("scissors beats paper");
    console.log("Player 1 Wins");
}else if(Player1choice=="rock" && Player2choice=="rock"){
console.log("It's a Tie!");
}else if(Player1choice=="paper" && Player2choice=="paper"){
    console.log("It's a Tie!");
}else if(Player1choice=="scissors" && Player2choice=="scissors"){
    console.log("It's a Tie!");
}else{
    console.log("Invalid Input");
}