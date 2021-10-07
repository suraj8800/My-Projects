// The purpose of this project is to extract information of worldcup 2019 from cricinfo.
// that in the form of excel and pdf scorecard
// the real purpose is to learn how to extract information and get experience with js
// a very good reason to ever make a project is to have fun

// npm init -y
// npm install minimist
// npm install axios
// npm install jsdom
// npm install excel4node
// npm install pdf-lib

// node CricinfoExtractor.js --excel=worldcup.csv --dataFolder=data --source="https://www.espncricinfo.com/series/ipl-2021-1249214/match-results" 

let minimist = require("minimist");
let axios = require("axios");
let jsdom = require("jsdom");
let excel4node = require("excel4node");
let pdf = require("pdf-lib");


let args = minimist(process.argv);
console.log(args.source);
console.log(args.excel);
console.log(args.dataFolder);
