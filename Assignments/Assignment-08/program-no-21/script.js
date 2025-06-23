// 21. Write a js program to input electricity unit charges and calculate total electricity bill.
var unit=prompt("Enter the total electricity units.");
if(unit<=50){
    var bill=unit*0.5;
}else if(unit<=150){
    var bill=25+(unit-50)*0.75;
}else if(unit<=250){
    var bill=100+(unit-150)*1.2;
}else{
    var bill=220+(unit-250)*1.5;
}
var surcharge=bill*0.2; 
var total=bill+surcharge;
console.log("Total bill is "+total+" Rs.");