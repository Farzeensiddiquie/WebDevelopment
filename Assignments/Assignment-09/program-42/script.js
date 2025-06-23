//42. Write a js program to convert Octal to Binary number system.
var octal=parseInt(prompt("Enter a octal number: "));
var binary=parseInt(octal,8).toString(2);
console.log("Binary number is: "+binary);
