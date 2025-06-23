//14. Write a js program to calculate sum of digits of a number.
var n = parseInt(prompt("Enter a number: "));
var sum = 0;
while (n > 0) {
  sum += n % 10;
  n = Math.floor(n / 10);
}
console.log("Sum of digits of a number is: " + sum);
