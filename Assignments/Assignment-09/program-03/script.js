//3. Write a js program to print all alphabets from a to z. - using while loop
var i = "a";
while (i <= "z") {
    console.log(i);
    i = String.fromCharCode(i.charCodeAt(0) + 1);
}


