var str = "this is a string";
var freq = {};  
for (var i=0; i<str.length;i++) {
    var character = str.charAt(i);
    if (freq[character]) {
       freq[character]++;
    } else {
       freq[character] = 1;
    }
}
console.log(freq);