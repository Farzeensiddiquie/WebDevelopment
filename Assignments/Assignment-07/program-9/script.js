//9. Weather Suggestion Experiment
var suggestion = prompt("Enter the weather sunny , rainy or cold");
switch (suggestion){
    case "sunny":
        console.log("Wear Sunglasses")
        break;
    case "rainy":
        console.log("Take an Umbrella");
        break;
    case "cold":
        console.log("Wear a jacket");
        break;
    default:
        console.log("Invalid input");
        break;
}