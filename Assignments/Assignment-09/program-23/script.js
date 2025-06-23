//23. Write a js program to calculate factorial of a number.
var num=parseInt(prompt("Enter a number: "));
var fact=1;
for(var i=1;i<=num;i++){
    fact=fact*i;
}
console.log("Factorial of "+num+" is "+fact);
