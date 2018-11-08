/*
npm i validator jsonwebtoken bcryptjs
*/

const mongoose = require('mongoose');

const validator = require('validator');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');

//we used schema to add easily the methods to the instance variable
var UserSchema = mongoose.Schema({
  email:{
    type:String,
    required:true,
    unique:true,
    minlength:1,
    trim:true,
    validate:{
      validator: validator.isEmail,
      message:'{VALUE} is not an email'
    }
  },
  password:{
    type:String,
    required:true,
    minlength:6
  },
  tokens:[{
    access:{
      type:String,
      required:true
    },
    token:{
      type:String,
      required:true
    }
  }]
});
/*override the toJSON method to prevent any secret attrbuites abot the user to
return and appear
*/
UserSchema.methods.toJSON = function (){
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject , ['_id','email']);
}
/*
steps for getAuthtoken:
1) get the user by using this
2)generate the token by jwt.sign
3)save the token in the user array tokens
4)return a promise to chain on it
*/
UserSchema.methods.getAuthToken = function(){
  var user = this;
  var access = "auth";

  //sign method => take the data and the salt it create the hash and return it
  var token = jsonwebtoken.sign({_id:user._id.toHexString(),access},'salt').toString();
  //save a new object with 2 fields the access and token
  user.tokens = user.tokens.concat({access,token});
  /*
  we return the user.save() as the promise to chain on it in the server.js
  function top() {
  //promise1
  return ParentPromise({
    ...some code here...
  }).then(function() {
    //promise2
    return ChildPromise({
          ..some code here...
    })
  }).then(function(response) {
    var result = response.result.items;
    // do something with `result`

    return result;
  });
}

top().then(function(result){
  // all done
});
  The basic idea is that inside of each function in your above block, you
  should be returning the next Promise in the chain
  in another word , to be able to chain the promise you need to return it
  */
return  user.save().then(()=>{
    //here you shoul return another promise because then return a promise inside it
    //but it's legal to return value and it will be the resolve value for the next promise
    return token;
  });
}

//it's mongoose middlware
UserSchema.pre('save',function(next){
  var user = this;

  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,res)=>{
        user.password = res;
        next();
      });
    });
  }
  else{
    next();
  }
});
/*
steps :
1) find user by email
2) compare the hashed email
to chain into the promises you need to return the promise
and inside the then your need to return a promise *RULE*
*/
UserSchema.statics.findByCredentials = function(email,password){
  var User = this;

  return User.findOne({email}).then((user)=>{
    if(!user)
      return Promise.reject();

    return new Promise((resolve,reject)=>{
      bcrypt.compare(password,user.password,(err,result)=>{
        if(result)
          resolve(user);
        else {
          reject();
        }
      });
    });
  });

}

UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;
  try{
    /*
    verifying will return the object which has been assigned and the object was have the id of the user
    */
    decoded = jsonwebtoken.verify(token,'salt');
  }
  catch{
    return Promise.reject();
  }
  return User.findOne({
    '_id':decoded._id,
    'tokens.token':token,
    'tokens.access':'auth'
  });
}

UserSchema.methods.removeToken = function(token){
  var user = this;
  return user.update({
    $pull: {
      tokens:{token}
    }
  });
}
var User = mongoose.model("user",UserSchema);

module.exports = {User};
