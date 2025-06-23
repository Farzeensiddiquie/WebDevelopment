
var String = "The quick brown fox jumps over the lazy dog";
var removeChar = "T";
var newString = "";
for (var i = 0; i < String.length; i++) {
    if (String[i] != removeChar) {
        newString += String[i];
    }
}
console.log(newString);
