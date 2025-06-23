//39. Write a js program to convert Binary to Octal number system.
var binary = parseInt(prompt("Enter a binary number: "));
var octal = parseInt(binary, 2).toString(8);
console.log(`The octal number is: ${octal}`);
