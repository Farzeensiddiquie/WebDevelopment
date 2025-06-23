//38. Write a js program to find two's complement of a binary number.
var binary=parseInt(prompt("Enter a binary number: "));
var onesComplement = ~binary;
var twosComplement = onesComplement + 1;
console.log("Twos complement of "+binary+" is: "+twosComplement);

