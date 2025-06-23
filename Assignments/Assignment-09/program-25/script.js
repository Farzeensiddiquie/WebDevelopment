//25. Write a js program to find LCM of two numbers.
var num1 = parseInt(prompt("Enter first number: "));
var num2 = parseInt(prompt("Enter second number: "));
var max = (num1 > num2) ? num1 : num2;
var lcm = max;
while(true) {
    if(lcm % num1 == 0 && lcm % num2 == 0) {
        console.log(`The LCM of ${num1} and ${num2} is ${lcm}`);
        break;
    }
    lcm += max;
}

