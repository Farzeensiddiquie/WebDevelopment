var string = "the quick brown fox jumps over the lazy dog";
var result = "";
for (var i = 0; i < string.length; i++) {
  if (result.indexOf(string[i]) === -1) {
    result += string[i];
  }
}
console.log(result);


