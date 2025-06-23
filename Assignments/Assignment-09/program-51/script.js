//51. Write a js program to print Pascal triangle upto n rows.
var n=parseInt(prompt("Enter the number of rows:"));
var arr=[];
for(var i=0;i<n;i++){
    arr[i]=[];
    for(var j=0;j<=i;j++){
        if(j==0 || j==i){
            arr[i][j]=1;
        }else{
            arr[i][j]=arr[i-1][j-1]+arr[i-1][j];
        }
    }
}
for(var i=0;i<n;i++){
    console.log(" ".repeat(n-i),arr[i].join(" "));
}
