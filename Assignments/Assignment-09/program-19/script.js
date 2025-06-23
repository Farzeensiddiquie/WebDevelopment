//19. Write a js program to enter a number and print it in words.
// For example, if user enters 1234 then output should be one thousand two hundred thirty four.
var num = prompt("Enter a number: ");
var words = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
var output = "";
for (var i = 0; i < num.length; i++) {
    output += words[num[i]] + " ";
}
console.log(output);


