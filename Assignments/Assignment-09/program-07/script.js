//7. Write a js program to find sum of all even numbers between 1 to n.
var n=parseInt(prompt("Enter the number:"));
var sum=0;
for(i=1;i<=n;i++){
    if(i%2===0){
        sum+=i
    }
}
console.log(sum)