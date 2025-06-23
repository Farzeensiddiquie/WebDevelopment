//10. Write a js program to check whether a character is uppercase or lowercase alphabet.
var char=prompt("Enter a character");
if(char>='a' && char<='z'){
    console.log(char+" is lowercase alphabet");
}else if(char>='A' && char<='Z'){
    console.log(char+" is uppercase alphabet");
}else{
    console.log("invalid input");
}