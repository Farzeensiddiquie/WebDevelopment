//26. Write a js program to check whether a number is Prime number or not.
var num = parseInt(prompt("Enter a number: "));
var flag = true;
if (num === 1) {
    console.log("1 is neither prime nor composite number.");
}
else if (num > 1) {
    for (var i = 2; i < num; i++) {
        if (num % i == 0) {
            flag = false;
            break;
        }
    }
    if (flag) {
        console.log(num + " is a prime number.");
    } else {
        console.log(num + " is not a prime number.");
    }
}
else {
    console.log("The number is not a prime number.");
}


