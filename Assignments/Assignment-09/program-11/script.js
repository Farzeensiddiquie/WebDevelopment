//11. Write a js program to find first and last digit of a number.
var number = parseInt(prompt("Enter a number: "));

if (number < 10) {
    console.log('The number has only one digit: ', number);
} else {
    var lastDigit = number % 10;
    var firstDigit = number;

    while (firstDigit >= 10) {
        firstDigit = Math.floor(firstDigit / 10);
    }

    console.log(`First digit: ${firstDigit}, Last digit: ${lastDigit}`);
}
