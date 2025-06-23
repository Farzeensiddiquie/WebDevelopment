//16. Write a js program to enter a number and print its reverse.
var num =parseInt(prompt("Enter a number: "));
var reverse = 0;
var remainder = 0;

while(num > 0){
    remainder = num % 10;
    reverse = reverse * 10 + remainder;
    num = parseInt(num / 10);
}
console.log(reverse);




