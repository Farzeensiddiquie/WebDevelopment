var string = "This is a string"
var frequency = []
for (var i = 0; i < string.length; i++) {
    if (frequency[string[i]]) {
        frequency[string[i]]++
    } else {
        frequency[string[i]] = 1
    }
}   
var max = 0
var result
for (var key in frequency) {
    if (frequency[key] > max) {
        max = frequency[key]
        result = key
    }
}
console.log(result) 


