//1. Write a js program to print all natural numbers from 1 to n. - using while loop
while (true) {
    let n = parseInt(prompt("Enter a number: "));
    if (n < 0) {
        console.log("Enter a positive number");
        continue;
    }
    let i = 1;
    while (i <= n) {
        console.log(i);
        i++;
    }
    break;
}



