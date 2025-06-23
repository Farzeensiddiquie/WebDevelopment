//32. Write a js program to check whether a number is Perfect number or not.
var num=parseInt(prompt("Enter a number:"));

var sum=0;
for(var i=1;i<num;i++){
    if(num%i==0){
        sum+=i;
    }
}
if(sum==num){
    console.log(num+" is a perfect number.");
}
