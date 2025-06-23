//Write a js program to check whether a character is alphabet or not.
var char=prompt("Enter a character");
if(char>='a' && char<='z' || char>='A' && char<='Z'){
    console.log(char+" is an alphabet");
}else{
    console.log(char+" is not an alphabet");
}