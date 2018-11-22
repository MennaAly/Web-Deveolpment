const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var UserSchema = mongoose.Schema({
  name:{
    type:String,
    required:true,
    minlength:1,
  },
  email:{
    type:String,
    trim:true,
    required:true,
    unique:true,
    minlength:1,
    validte:{
      validator:validator.isEmail,
      message:'{Value} is not an Email'
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

UserSchema.methods.getAuthToken = function(){
  var user= this;
  var access = 'auth';
  var expiresIn = 300000;
  var token = jwt.sign({_id:user._id.toHexString(),access,expiresIn},'salt').toString();
  user.tokens = user.tokens.concat({access,token});
  return user.save().then(()=>{
    return token;
  });
};

UserSchema.pre('save',function(next){
  var user = this;
  if(user.isModified('password')){
    bcrypt.genSalt(10,(err,salt)=>{
      bcrypt.hash(user.password,salt,(err,hash)=>{
        user.password = hash;
        next();
      });
    });
  }
  else{
    next();
  }
});

UserSchema.statics.findByCrediantels = function(email,password){
  var User = this;
  return User.findOne({email}).then((user)=>{
    console.log('user from schema',user);
    if(!user)
      return  Promise.reject();
   return new Promise((resolve,reject)=>{
     //we must put in the first argument the value we will compare with and the hash value
      bcrypt.compare(password,user.password,(err,res)=>{
        if(res)
          resolve(user);
        else {
          reject();
        }
      }) ;
   });
 });
}
UserSchema.statics.findByToken = function(token){
  var User = this;
  var decoded;
  try{
    decoded = jwt.verify(token,'salt');
    console.log("end of the decoding part");
  }catch{
    console.log('catching error');
    return Promise.reject();
  }

return User.findOne({
       '_id':decoded._id,
       'tokens.token':token,
       'tokens.access': 'auth'
      });
};
var User = mongoose.model('User', UserSchema);

module.exports = {User};
