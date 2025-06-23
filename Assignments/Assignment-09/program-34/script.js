//34. Write a js program to check whether a number is Strong number or not.
var num= parseInt(prompt("Enter a number: "));
var sum=0;
var temp=num;
while(temp>0){
    let rem=temp%10;
    let fact=1;
    for(let i=1;i<=rem;i++){
        fact=fact*i;
    }
    sum=sum+fact;
    temp=parseInt(temp/10);
}
if(sum==num){
    console.log(num+" is a Strong number");
}
else{
    console.log(num+" is not a Strong number");
}

