//15. Write a js program to input all sides of a triangle and check whether triangle is valid or not.
var Side_a=Number(prompt("Enter 'a' side of triangle.")) 
var Side_b=Number(prompt("Enter 'b' side of triangle."))
var Side_c=Number(prompt("Enter 'c' side of triangle."))
if((Side_a>0 && Side_b>0 && Side_c>0)&&((Side_a+Side_b)>Side_c)){
     console.log("Triangle is valid.")
   }else{
    console.log("Triangle is invalid")
}