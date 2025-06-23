//17. Write a js program to find all roots of a quadratic equation.
var a=prompt("Enter the value of a");
var b=prompt("Enter the value of b");
var c=prompt("Enter the value of c");
var d=b*b-4*a*c;
if(d>0){
    var root1=(-b+Math.sqrt(d))/(2*a);
    var root2=(-b-Math.sqrt(d))/(2*a);
    console.log("Roots are "+root1+" and "+root2);
}
else if(d==0){
    var root=(-b+Math.sqrt(d))/(2*a);
    console.log("Root is "+root);
}
else{
    console.log("Roots are imaginary");
}   