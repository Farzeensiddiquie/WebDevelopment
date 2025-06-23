//14. Write a js program to input angles of a triangle and check whether triangle is valid or not.
var angle1= Number(prompt("Enter the angle 'a'."))
var angle2= Number(prompt("Enter the angle 'b'."))
var angle3= Number(prompt("Enter the angle 'c'."))
if((angle1>0 && angle2>0 && angle3>0) && ((angle1+angle2+angle3)==180)){
console.log("Triangle is Valid.")
}else{
    console.log("This is not a valid Triangle.")
}