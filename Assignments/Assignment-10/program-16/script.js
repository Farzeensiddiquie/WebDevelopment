var string = "Hello World";  
var character = "l";  
var index = [];  

for (var i = 0; i < string.length; i++) {  
    if (string[i] === character) {
      index.push(i);  
      }
}    
console.log(index); 