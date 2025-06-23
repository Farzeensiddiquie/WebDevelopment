//30. Write a js program to check whether a number is Armstrong number or not.
var  num = parseInt(prompt('Enter a three-digit positive integer: '));
var originalNumber, remainder, result = 0;
originalNumber = num;
while (originalNumber !== 0) {
    remainder = originalNumber % 10;
    result += remainder * remainder * remainder;
    originalNumber = parseInt(originalNumber / 10); 
}
if (result === num) {
    console.log(num + ' is an Armstrong number.');
} else {
    console.log(num + ' is not an Armstrong number.');
}
