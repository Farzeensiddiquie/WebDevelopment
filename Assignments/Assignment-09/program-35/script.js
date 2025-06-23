//35. Write a js program to print all Strong numbers between 1 to n.

var num= parseInt(prompt("Enter a number: "));

for (var i = 1; i <= num; i++) {
    var sum = 0;
    var temp = i;
    while (temp > 0) {
        var rem = temp % 10;
        var fact = 1;
        for (var j = 1; j <= rem; j++) {
            fact = fact * j;
        }
        sum = sum + fact;
        temp = parseInt(temp / 10);
    }
    if (sum == i) {
        console.log(i);
    }
}






