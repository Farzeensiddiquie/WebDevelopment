
var String = "The quick brown fox jumps over the lazy dog";
var char = "o";
var last = String.lastIndexOf(char);
if (last > -1) {
    String = String.slice(0, last) + String.slice(last + 1);
  }
  console.log(String);
