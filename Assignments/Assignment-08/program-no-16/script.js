//16. Write a js program to check whether the triangle is equilateral, isosceles or scalene triangle
let Angle_a = Number(prompt("Enter the 'a' Angle of triangle"));
let Angle_b = Number(prompt("Enter the 'b' Angle of triangle"));
let Angle_c = Number(prompt("Enter the 'c' Angle of triangle"));

if (Angle_a < 0 || Angle_b < 0 || Angle_c < 0 || Angle_a + Angle_b + Angle_c !== 180) {
    console.log("This is not a valid triangle.");
} else if (Angle_a === Angle_b && Angle_b === Angle_c) {
    console.log("It is an equilateral triangle.");
} else if (Angle_a === Angle_b || Angle_a === Angle_c || Angle_b === Angle_c) {
    console.log("It is an isosceles triangle.");
} else {
    console.log("It is a scalene triangle.");
}



