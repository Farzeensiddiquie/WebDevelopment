//10. Simple Arithmetic Quiz
var operators=[ "+", "-", "*", "/" ];
var random1 = Math.floor(Math.random() * 100);
var random2 = Math.floor(Math.random() * 100);
var operator = operators[Math.floor(Math.random() * operators.length)];
var answer = eval(random1 + operator + random2);
var userAnswer = prompt("What is " + random1 + operator + random2 + "?");

if (userAnswer == answer) {
    console.log("Correct!");
} else {
    console.log("Incorrect Answer Try again!. The correct answer is " + answer);
}




