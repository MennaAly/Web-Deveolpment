
var {User} = require('./../models/user');
//this middleware will save the user and it's token in the request attrbuite
var authenticate = function(req,res,next){
  var token = req.header('x-auth');

  User.findByToken(token).then((user)=>{
    console.log("the user", user);
    if(!user)
      return Promise.reject();
    req.user = user;
    req.token = token;
    next();
  }).catch((e)=>res.status(401).send());
}

module.exports = {authenticate};
