var String = "Hello World";
var String2 = "";
for (var i = 0; i < String.length; i++) {
    if (String[i] === String[i].toUpperCase()) {
        String2 += String[i].toLowerCase();
    } else {
        String2 += String[i].toUpperCase();
    }
    }
console.log(String2);
