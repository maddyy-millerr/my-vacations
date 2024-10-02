// // Variables and constants
// let mutableVariable = 'I can be changed';
// const immutableConstant = 'I cannot be changed';

// // Global scope
// let globalVar = "I'm global";

// function exampleFunction() {

//     // Fucnction scope
//     let functionVar = "I'm function-scoped";

//     if (true) {
//         // Block scope
//         let blockVar = "I'm block-scoped";
//         var varVariable = "I'm function scoped (var)";

//         console.log(globalVar); // accessible
//         console.log(functionVar); // accessible
//         console.log(blockVar); // accessible
//         console.log(varVariable); // accessible
//     }

//     console.log(globalVar); // accessible
//     console.log(functionVar); // accessible
//     // console.log(blockVar); // ERROR: blockVar is not defined
//     console.log(varVariable); // accessible
// } // exampleFunction

// exampleFunction();

// console.log(globalVar); // accessible
// // console.log(functionVar); // not accessible
// // console.log(varVariable); // not accessible
// // console.log(blockVar); // not accessible

// // template literals
// const name = "Alice";
// console.log(`Hello ${name}!`);

// // Arrow Functions
// const greet = (name) => `Hello ${name}!`;
// console.log(greet("Bob"));

// // default parameters
// const multiply = (a, b = 1) => a * b;
// console.log(multiply(5)); // 5
// console.log(multiply(5, 2)); // 10

// // rest parameters - varargs in other languages
// const sum = (...numbers) => numbers.reduce((acc, num) => acc + num, 0);
// console.log(sum(1, 2, 3, 4)); // 10

// // destructuring
// const person = {firstName: 'John', lastName: 'Doe', age: 30};
// const [firstName, lastName] = person;
// console.log(`${firstName} ${lastName}`); // John Doe

// // arrays and array methods
// const fruits = ['apple', 'banana', 'orange'];

// // array for in loop
// for (let thing in fruits) {
//     console.log("for in returns index: " + thing);
// }

// // array for of loop
// for (let thing of fruits) {
//     console.log("for of returns value: " + thing);
// }

// // standard for loop
// for (let x = 0; x < fruits.length; x++) {
//     console.log("standard loop: " + fruits[x]);
// }

// // forEach
// fruits.forEach(fruit => console.log(fruit));

// // filter
// const longFruits = fruits.filter(fruit => fruit.length > 5);
// console.log(longFruits);

// // spread operator - quickly copies all of part of an array into another
// const moreFruits = [...fruits, 'grape', 'kiwi'];
// console.log(moreFruits);

// // map - creates a new array by applying a function to every element
// // in the array - usually used to transform data
// const numbers = [1, 2, 3, 4, 5];
// const doubledNumbers = numbers.map(num => num * 2);
// console.log(doubledNumbers); // [2, 4, 6, 8, 20]

// const upperCaseFruits = fruits.map((fruit) => fruit.toUpperCase());
// console.log(upperCaseFruits); // ['APPLE', 'BANANA', 'ORANGE']

// const users = [
//     { id: 1, name: "Alice", age: 30 },
//     { id: 2, name: "Bob", age: 25 },
//     { id: 3, name: "Charlie", age: 35 },
// ];

// const userNames = users.map((user) => user.name);
// console.log(userNames);

// const indexedArray = ['a', 'b', 'c'].map((item, index) => `${index}: ${item}`);

// const stringNumbers = ["1", "2", "3", "4"];
// const integers = stringNumbers.map((num) => parseInt(num));
// console.log(integers);

// // Object literal notation - JSON
// let person2 = {
//     name: "Alice",
//     age: 30,
//     greet: function() {
//         console.log(`Hello, I'm ${this.name}`);
//     },
// };

// // Using the Object constructor
// let car = new Object();
// car.make = "Toyota";
// car.model = "Corolla";

// console.log(person2.name); // dot notation
// console.log(person2['age']); // bracket notation

// // Dynamic property access
// let propertyName = "name";
// console.log(person2[propertyName]);

// // Accessing methods
// person2.greet();

// // ES6 method shorthand
// let calculator = {
//     add(a, b) {
//         return a + b;
//     },
// };

// console.log(calculator.add(5, 3)); // 8

// // Using Object.create()
// // object template
// let animal = {
//     makeSound: function() {
//         console.log("Some generic sound");
//     },
// };

// let dog = Object.create(animal);
// dog.makeSound();

// // Classes
// class Animal {
//     constructor(name) {
//         this.name = name;
//     }

//     speak() {
//         console.log(`${this.name} makes a sound`);
//     }
// } // Animal

// class Dog extends Animal {
//     speak() {
//         console.log(`${this.name} barks`);
//     }
// }

// const rover = new Dog("Rover");
// rover.speak();

// // Object for in - for of does not work with Objects
// for (let attribute in person2) {
//     console.log("for in objects returns key: " + attribute);
// }

// // Promises
// const fetchData = () => {
//     return new Promise((resolve, reject) => {
//         setTimeout(() => {
//             resolve("Data fetched successfully");
//         }, 2000);
//     });
// };

// fetchData()
//     .then((data) => console.log(data))
//     .catch((error) => console.log(error));

// // Async/Await
// const getData = async () => {
//     try {
//         const result = await fetchData();
//         console.log(result);
//     }   catch(error) {
//         console.log(error);
//     }
// };

// getData();

const book1 = {
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Future",
    edition: 1,
    published: 1949,
};

// html to insert
let bookTitle = `<h2>${book1.title}</h2>`;

console.log(book1);
console.log(book1.author);
document.querySelector(".container").insertAdjacentHTML("beforeend", bookTitle);