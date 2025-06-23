//17. Write a js program to check whether a number is palindrome or not.
var num =parseInt(prompt("Enter a number: "));
var originalNum = num;
var reverse = 0;
var remainder = 0;

while(num > 0){
    remainder = num % 10;
    reverse = reverse * 10 + remainder;
    num = parseInt(num / 10);
}
console.log("The reverse number is", reverse);
if(originalNum === reverse){
    console.log("The number is a palindrome.");
}