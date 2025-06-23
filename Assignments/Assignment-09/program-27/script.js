//27. Write a js program to print all Prime numbers between 1 to n.
var num=parseInt(prompt("Enter a number: "));
for(var i=2;i<=num;i++){
    var flag=0;
    for(var j=2;j<=i/2;j++){
        if(i%j==0){
            flag=1;
            break;
        }
    }
    if(flag==0){
        console.log(i);
    }
}