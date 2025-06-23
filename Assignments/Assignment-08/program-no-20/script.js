// 20. Write a js program to input basic salary of an employee and calculate its Gross salary.
var basicSalary=Number(prompt("Enter basic salary"));
if(basicSalary<=10000){
console.log("HRA is 20% and DA is 80%");
var HRA=basicSalary*0.2;
var DA=basicSalary*0.8;
var grossSalary=basicSalary+HRA+DA;
console.log("Gross salary is "+grossSalary);
}else if(basicSalary<=20000){
    console.log("HRA is 25% and DA is 90%");    
    var HRA=basicSalary*0.25;
    var DA=basicSalary*0.9;
    var grossSalary=basicSalary+HRA+DA;
    console.log("Gross salary is "+grossSalary);
}else{
    console.log("HRA is 30% and DA is 95%");    
    var HRA=basicSalary*0.3;
    var DA=basicSalary*0.95;
    var grossSalary=basicSalary+HRA+DA;
    console.log("Gross salary is "+grossSalary);
}




