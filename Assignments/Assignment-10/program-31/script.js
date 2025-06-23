
var string= "I am a good person.A person is good.";
var count = 0;
var word ="good"
var index=string.indexOf(word);
while(index!=-1){
    count++;
    index=string.indexOf(word,index+1);
}
console.log("The word "+word+" occurs "+count+" times in the given string.");