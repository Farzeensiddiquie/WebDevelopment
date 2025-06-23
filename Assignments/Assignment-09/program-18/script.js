//18. Write a js program to find frequency of each digit in a given integer

var num = parseInt(prompt("Enter a number: "));
var frequency = {};

while (num > 0) {
    var digit = num % 10;
    if (frequency[digit]) {
        frequency[digit]++;
    } else {
        frequency[digit] = 1;
    }
    num = parseInt(num / 10);
}

console.log("Digit frequencies:", frequency);
