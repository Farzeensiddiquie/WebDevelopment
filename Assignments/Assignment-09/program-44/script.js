//44. Write a js program to convert Octal to Hexadecimal number system.
var octal= parseInt(prompt("Enter a octal number"));
var hexa = parseInt(octal, 8).toString(16);
console.log("Hexadecimal number is: "+hexa);
