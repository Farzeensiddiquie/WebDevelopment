//11. Eligibility for Voting
var age=prompt("Enter your age");
if (age>=18 && age<=120) {
    console.log("You are Eligible to vote")
    
}else if(age<18){
    console.log("Yoy are not eligible to vote")
}else{
    console.log("Invalid input")
}