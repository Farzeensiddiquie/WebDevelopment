//10. Write a js program to count number of digits in a number.
var num = parseInt(prompt("Enter a number: "));
var count = 0;
while(num > 0){
    num = parseInt(num/10);
    count++;
}
console.log("Number of digits: "+count);