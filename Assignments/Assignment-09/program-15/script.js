//15. Write a js program to calculate product of digits of a number.
var n = parseInt(prompt("Enter a number: "));
var product = 1;
while (n > 0) {
  product *= n % 10;
  n = Math.floor(n / 10);
}
console.log("Product of digits of a number is: " + product);