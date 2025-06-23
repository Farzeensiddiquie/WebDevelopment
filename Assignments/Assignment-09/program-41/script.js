//41. Write a js program to convert Binary to Hexadecimal number system.
var binary = parseInt(prompt("Enter a binary number: "));
var hex = parseInt(binary, 2).toString(16);
console.log("Hexadecimal number is: " + hex);
