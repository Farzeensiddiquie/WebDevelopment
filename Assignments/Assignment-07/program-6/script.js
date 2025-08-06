//6. Simple Temperature Conversion
var temp = prompt("choose 0 for celsius to fahrenheit and 1 for fahrenheit to celsius");

if(temp==0){
    var celsius = prompt("Enter the temperature in celsius");
    var fahrenheit = (celsius*9/5)+32;
    console.log(fahrenheit);
}else if(temp==1){
    var fahrenheit = prompt("Enter the temperature in fahrenheit");
    var celsius = (fahrenheit-32)*5/9;
    console.log(celsius);
}else{
    console.log("Invalid Input");
}