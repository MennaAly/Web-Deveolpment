const mongoose = require('mongoose');
var pollSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
    minlength:1
  },
  options:[{
    name:{
      type:String,
    },
    votes:{
      type:Number,
      default:0
    },
    _id:false
  }],
  creator:{
    type:mongoose.Schema.Types.ObjectId,
    required:true
  },
  result:{
    type:Number,
    default:0
  }
});

pollSchema.methods.checkAccess = function(user){
    var poll = this;
    return new Promise((resolve,reject)=>{
      console.log("creator ", poll.creator);
      console.log("---------------");
      console.log("user ", user._id);
      if(poll.creator.toHexString() == user._id.toHexString()){
        console.log("access accepted");
        resolve();
      }
      else{
        console.log("access rejected");
        reject();
      }
    });
}

var Poll = mongoose.model('Poll',pollSchema);

module.exports = {Poll};
