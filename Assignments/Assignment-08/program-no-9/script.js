//9. Write a js program to input any character and check whether it is alphabet, digit or special character.
var char=prompt("Enter a character");
if(char>='a' && char<='z' || char>='A' && char<='Z'){
    console.log(char+" is an alphabet");
}else if(char>='0' && char<='9'){
    console.log(char+" is a digit");
}else if(char==' '){
console.log(char+" is a space");
}else if(char==''){
    console.log("Invalid input");
}else{
    console.log(char+" is a special character");
}