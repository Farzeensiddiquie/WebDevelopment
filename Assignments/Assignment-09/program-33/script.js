//33. Write a js program to print all Perfect numbers between 1 to n.
var num= parseInt(prompt("Enter a number: "));
var sum=0;
for(var i=1; i<=num; i++){
    for(var j=1; j<i; j++){
        if(i%j==0){
            sum+=j;
        }
    }
    if(sum==i){
        console.log(i);
    }
    sum=0;
}


