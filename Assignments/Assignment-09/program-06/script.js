//6. Write a js program to find sum of all natural numbers between 1 to n.
var n = parseInt(prompt("Enter a number: "));
var sum = 0;
for (var i = 1; i <= n; i++) {
  sum += i;
}
console.log("Sum of all natural numbers between 1 to " + n + " is: " + sum);