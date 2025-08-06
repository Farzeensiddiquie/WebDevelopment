// 7. Password Strength Checker
var password = prompt("Enter the password");

if(password.length<5){
    console.log("Weak Password");
}else if(password.length>=5 && password.length<=7){
    console.log("Moderate Password");

}else if(password.length>=8 && password.match(/[!@#$%^&*]/)){
console.log("Strong Password");
}else if(password.length>=8){
    console.log("Good password!. Use special characters for extra security");
}