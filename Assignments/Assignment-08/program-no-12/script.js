//12. Write a js program to input month number and print number of days in that month.
var monthNumber=prompt("Enter month number from 1 to 12");
if(monthNumber==1 || monthNumber==3 || monthNumber==5 || monthNumber==7 || monthNumber==8 || monthNumber==10 || monthNumber==12){
    console.log("31 days");
}else if(monthNumber==2){
    console.log("28 days");
}else if(monthNumber==4 || monthNumber==6 || monthNumber==9 || monthNumber==11){
    console.log("30 days");
}else{
    console.log("Invalid input");
}
