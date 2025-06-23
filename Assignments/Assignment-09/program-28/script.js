//28. Write a js program to find sum of all prime numbers between 1 to n.
var num =parseInt(prompt("Enter a number: "));
var sum = 0;
for (var i = 2; i <= num; i++) {
    var prime = true;
    for (var j = 2; j < i; j++) {
        if (i % j == 0) {
            prime = false;
            break;
        }
    }
    if (prime) {
        sum += i;
    }
}
console.log("Sum of all prime numbers between 1 to "+num+" is: "+sum);