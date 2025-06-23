//19. Write a js program to input marks of five subjects Physics, Chemistry, Biology, Mathematics and Computer. 
var physics=Number(prompt("Enter marks of Physics from 0 to 100."));
var chemistry=Number(prompt("Enter marks of Chemistry from 0 to 100."));
var biology=Number(prompt("Enter marks of Biology from 0 to 100."));
var mathematics=Number(prompt("Enter marks of Mathematics from 0 to 100."));
var computer=Number(prompt("Enter marks of Computer from 0 to 100."));
var percentage=(physics+chemistry+biology+mathematics+computer)/5;
if(physics>100 || chemistry>100 || biology>100 || mathematics>100 || computer>100){
    console.log("Invalid Input");
}else if(percentage>=90){
    console.log("Grade A");
}else if(percentage>=80){
    console.log("Grade B");
}else if(percentage>=70){
    console.log("Grade C");
}else if(percentage>=60){
    console.log("Grade D");
}else if(percentage>=40){
    console.log("Grade E");
}else{
    console.log("Grade F");
}
