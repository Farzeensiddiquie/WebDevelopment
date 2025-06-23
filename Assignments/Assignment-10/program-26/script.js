var str = 'The quick brown fox jumps over the lazy dog';
var char = 'o';
var replaceChar = '0';
var lastOccurrence = str.lastIndexOf(char);
var newStr = str.substring(0, lastOccurrence) + replaceChar + str.substring(lastOccurrence + 1);
console.log(newStr); 
