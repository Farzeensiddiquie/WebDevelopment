//36. Write a js program to print Fibonacci series up to n terms.
var num=parseInt(prompt("Enter the number of terms:"));
var n1=0,n2=1,n3;
console.log("Fibonacci series up to "+num+" terms:");
console.log(n1);
console.log(n2);
for(var i=2;i<num;i++){
    n3=n1+n2;
    console.log(n3);
    n1=n2;
    n2=n3;
}
