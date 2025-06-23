//48. Write a js program to convert Hexadecimal to Binary number system.
var Hexadecimal = parseInt(prompt("Enter a Hexadecimal number: "));
var Binary = parseInt(Hexadecimal, 16).toString(2);
console.log("Binary number is: " + Binary);
