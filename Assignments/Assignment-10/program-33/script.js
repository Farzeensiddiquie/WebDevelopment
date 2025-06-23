
var string = "The quick brown fox jumps over the lazy dog";
var word = "the";
var newString = string.split(" ");
var index = newString.lastIndexOf(word);
newString.splice(index, 1);
console.log(newString.join(" "));