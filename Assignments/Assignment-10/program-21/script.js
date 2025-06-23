
var string = "The quick brown fox jumps over the lazy dog";
var char = "o";
var index = string.indexOf(char);
if (index > -1) {
  string = string.slice(0, index) + string.slice(index + 1);
}
console.log(string);
