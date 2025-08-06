//3.Water Temperature Checker
var temperature = prompt("Enter the temperature of the water in celsius");

if(temperature<=0){
    console.log("Freezing");
}else if(temperature>0 && temperature<=15){
    console.log("Cold");
}else if(temperature>15 && temperature<=30){
    console.log("Warm");
}else if(temperature>30){
    console.log("Hot");
}
else{
    console.log("Invalid temperature");
}