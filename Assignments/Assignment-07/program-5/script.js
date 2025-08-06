//5.Simple Alarm System
var question1 = prompt("Is the door open?");
var question2 = prompt("Is motion detected?");

if(question1=="yes" || question2=="yes"){
    console.log("Alarm is triggered");
}else if(question1=="no" && question2=="no"){
console.log("All safe");
}else{
    console.log("Invalid Input");
}