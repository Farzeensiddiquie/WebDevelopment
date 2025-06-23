// 21. Write a js program to find power of a number using for loop.

var base = parseInt(prompt('Enter base number: '));
var exponent = parseInt(prompt('Enter exponent number: '));
var result = 1;

for (var i = 1; i <= exponent; i++) {
    result *= base;
}   

console.log(`${base}^${exponent} = ${result}`);

