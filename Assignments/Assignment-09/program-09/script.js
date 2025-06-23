//9. Write a js program to print multiplication table of any number.

var num = parseInt(prompt("Enter a number to print multiplication table: "));
for (let i = 1; i <= 10; i++) {
    console.log(`${num} * ${i} = ${num * i}`);
}

