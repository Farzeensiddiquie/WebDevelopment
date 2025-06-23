//8. Write a js program to input any alphabet and check whether it is vowel or consonant.
var char=prompt("Enter a character");
if(char=='a' || char=='e' || char=='i' || char=='o' || char=='u' || char=='A' || char=='E' || char=='I' || char=='O' || char=='U'){
    console.log(char+" is a vowel");
}else if(char>='a' && char<='z' || char>='A' && char<='Z'){
    console.log(char+" is a consonant");
}else{
    console.log("invalid input");
}