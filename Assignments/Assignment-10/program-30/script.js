
var string="The quick brown fox jumps over the lazy dog.";
var word="the";
var count=0;
var index=string.indexOf(word);
while(index!=-1){
    count++;
    index=string.indexOf(word,index+1);
}
console.log("The word "+word+" occurs "+count+" times in the given string.");
