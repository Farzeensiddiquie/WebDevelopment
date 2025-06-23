var String = "Ahmad1/.@39"
var specialCharecters = [".","@",",","!","$","%","^","&","*","(",")","_","-","+","=","[","]","{","}","|",";",":","'","<",">","?","/","~","`"]
var numbers = [0,1,2,3,4,5,6,7,8,9]
var Alphabets = ["A","a","B","b","C","c","D","d","E","e","F","f","G","g","H","h","I","i","J","j","K","k","L","l","M","m","N","n","O","o","P","p","Q","q","R","r","S","s","T","t","U","u","V","v","W","w","X","x","Y","y","Z","z"]
var totalspecialcharecters =""
var totalAlphbets =""
var totalnumbers = "" 
for(i=0;i<=String.length;i++){
if (specialCharecters.includes(String[i])){
    totalspecialcharecters += String[i]
}else if (numbers.includes(Number(String[i]))){
    totalnumbers += String[i]
}else if (Alphabets.includes(String[i])){
    totalAlphbets += String[i]
}
}


console.log("Numbers are:",totalnumbers)
console.log("Alphabets are:",totalAlphbets)
console.log("Special Charecters are:",totalspecialcharecters)