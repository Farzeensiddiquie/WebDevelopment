//31. Write a js program to print all Armstrong numbers between 1 to n.
var num=parseInt(prompt("Enter the number:"));
var sum=0;
for(var i=1;i<=num;i++){
    var temp=i;
    while(temp>0){
        var rem=temp%10;
        sum+=rem*rem*rem;
        temp=parseInt(temp/10);
    }
    if(sum==i){
        console.log(i);
    }
    sum=0;
}



