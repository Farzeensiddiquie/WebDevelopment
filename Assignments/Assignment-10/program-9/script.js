var vowels=["A","a","E","e","I","i","O","o","U","u"];
var consonants= ["B","b","C","c","D","d","F","f","G","g","H","h","J","j","K","k","L","l","M","m","N","n","P","p","Q","q","R","r","S","s","T","t","V","v","W","w","X","x","Y","y","Z","z"];
var String = "Hello World";
var vowelsCount = "";
var consonantsCount = "";
for(i=0;i<String.length;i++){
    if(vowels.includes(String[i])){
        vowelsCount+=String[i];
    }else if(consonants.includes(String[i])){
        consonantsCount+=String[i];
    }
}
console.log("Vowels are:",vowelsCount);
console.log("Consonants are:",consonantsCount);