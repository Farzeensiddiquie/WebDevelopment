//13. Write a js program to count total number of notes in given amount and uses almost all notes.
var amount=prompt("Enter the amount");
if(amount<0){
  console.log("Please Enter a valid amount.")
}else{
var notes=[5000,1000,500,200,100,50,20,10,5,2,1];
var count=0;
for(var i=0;i<notes.length;i++){
  while(amount>=notes[i]){
    amount=amount-notes[i];
    count++;
  }
}
console.log("Total number of notes is "+count);
}



