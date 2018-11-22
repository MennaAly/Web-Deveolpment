const express = require('express');
const path = require('path');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');


var app = express();
var publicPath = path.join(__dirname,'/../public');
var userController = require('./../controllers/userController');
var pollController = require('./../controllers/pollController')

app.set('view engine','ejs');
app.use(bodyparser.urlencoded({
  extended: true
}));
app.use(cookieParser());
app.use(bodyparser.json());
app.use(express.static(publicPath));

//fire the controller
userController(app);
pollController(app);

app.listen(3000);
