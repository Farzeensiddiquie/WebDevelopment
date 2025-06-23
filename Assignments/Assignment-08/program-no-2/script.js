//2. Write a js program to find maximum between three numbers.
var num1=prompt("Enter first number");
var num2=prompt("Enter second number");
var num3=prompt("Enter third number");
if(num1>num2 && num1>num3){
    console.log(num1+" is greater than "+num2+" and "+num3);
}
else if(num2>num1 && num2>num3){
    console.log(num2+" is greater than "+num1+" and "+num3);
}else{
    console.log(num3+" is greater than "+num1+" and "+num2);
}