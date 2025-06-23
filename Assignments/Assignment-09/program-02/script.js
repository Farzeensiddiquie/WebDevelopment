//2. Write a js program to print all natural numbers in reverse (from n to 1). - using while loop
while (true) {
    var n = parseInt(prompt("Enter a number: "));
    if (n < 0) {
        console.log("Please enter a positive number.");
    } else {
        while (n > 0) {
            console.log(n);
            n--;
        }
        break;
    }
    
}

