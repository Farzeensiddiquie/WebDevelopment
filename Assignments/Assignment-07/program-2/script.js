//2.Traffic light simulator
var color = prompt("Enter the color of the traffic light");

if(color=="red"){
    console.log("Stop");
}else if(color=="yellow"){
    console.log("Slow down");
}else if(color=="green"){
    console.log("Go");
}else{
    console.log("Invalid color");
}