//29. Write a js program to find all prime factors of a number.

var num = parseInt(prompt("Enter a number: "));
var primeFactors = [];
for (var i = 2; i <= num; i++) {
    while (num % i === 0) {
        primeFactors.push(i);
        num = num / i;
    }
}
console.log(primeFactors);
document.write(primeFactors);
