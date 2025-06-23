//18. Write a js program to calculate profit or loss.
var costPrice=Number(prompt("Enter the cost price"));
var sellPrice=Number(prompt("Enter the sell price"));
var profit=sellPrice-costPrice;
if(profit>0){
    console.log("Profit is "+profit);
}
else{
    console.log("Loss is "+(-profit));
}
