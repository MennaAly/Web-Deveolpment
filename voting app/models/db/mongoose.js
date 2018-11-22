const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/VotingAPP");
//we will use it in the server
module.exports = {mongoose};
