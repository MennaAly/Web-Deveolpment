/*
npm i mongoose
what's mongoose ?
the mongoose is an framework to work with the mongodb
node path 
*/
const mongoose = require('mongoose');

// we use the promises and we tell the program which promises we'll use
//the promises is not in the language it's a library
//so we must grap and use it
mongoose.Promise = global.Promise;
//we connect to the db if it wasn't exist it'll be created
mongoose.connect("mongodb://localhost:27017/stockMarket");

//we put the mongoose which connected to our db to the exports
//to use it in the server
module.exports = {mongoose};
