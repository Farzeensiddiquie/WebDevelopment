//12. Maximum of Two Numbers
var num1=prompt("Enter a number");
var num2=prompt("Enter an another number");
if (num1>num2){
    console.log(num1);
    console.log("This is a greater number");
    }else if(num2>num1){
        console.log(num2);
        console.log("This is a greater number");   
}else if(num1==num2){
    console.log("Both numbers are equal");
}else{
    console.log("Invalid input");
}