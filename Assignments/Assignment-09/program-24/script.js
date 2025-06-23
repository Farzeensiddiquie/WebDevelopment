//24. Write a js program to find HCF (GCD) of two numbers.
var num1=parseInt(prompt("Enter the first number: "));
var num2=parseInt(prompt("Enter the second number: "));
var hcf;
for(var i=1;i<=num1 && i<=num2;i++){
    if(num1%i==0 && num2%i==0){
        hcf=i;
    }
}

console.log("HCF of "+num1+" and "+num2+" is: "+hcf);