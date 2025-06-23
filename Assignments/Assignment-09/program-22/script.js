//22. Write a js program to find all factors of a number.
var num = parseInt(prompt("Enter a number: "));
var factors = [];
for (var i = 1; i <= num; i++) {
    if (num % i == 0) {
        factors.push(i);
    }
}   
console.log("Factors of " + num + " are: " + factors.join(", "));


