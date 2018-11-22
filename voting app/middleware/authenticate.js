var {User} = require('./../models/user');

var authenticate = function(req,res,next){

  //helper method to clear the cookie
  function clearTokenAndNext() {
       res.clearCookie("token").render('unathenticateTemplate');
   }
   //to get the cookie
   var {token} = req.cookies;

   //if there's no cookie with this name
   if(!token){
    return clearTokenAndNext();
   }

  User.findByToken(token).then((user)=>{
    //if there's error , expired cookie or no user found
    if(!user){
      console.log("no user");
      return clearTokenAndNext();
    }
    req.user = user;
    req.token = token;
    console.log("end of the authentication process");
    next();
  }).catch((e)=>{res.render('unathenticateTemplate')});
}

module.exports = {authenticate};
