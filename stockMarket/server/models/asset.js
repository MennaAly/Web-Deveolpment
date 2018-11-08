const mongoose = require('mongoose');

//we make a model woth asset name and use mongoose.model
//(modelName,{schema})
//schema => colName:{type,required,default,}
//type of the col could be :Nmber,String,Date,Buffer,Boolean,ObjectID,Map,Array
var Asset = mongoose.model("asset",{
  name:{
    type:String,
    required:true,
    minlength:1
  },
  price:{
    type:Number,
    required:true,
    default:0
  }
});

//we put it into the exports to use it in the server
module.exports = {Asset};
