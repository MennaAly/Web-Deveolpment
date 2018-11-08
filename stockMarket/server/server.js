/*
npm i express mongodb body-parser lodash
to run it node server.js
*/
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

//we do this {} when we want a specific thing from the library or the module
const {mongoose} = require('./db/mongoose');
const {Asset} = require('./models/asset');
const {ObjectID} = require('mongodb');
const {User} = require('./models/user');
const {authenticate} = require('./middleware/authentication');

//loading for the express
var app = express();

//we add a new layer for parsing the body of incoming requests
app.use(bodyParser.json());

app.post('/asset',(req,res)=>{
  var newAsset = new Asset({
    name:req.body.name,
    price:req.body.price
  });
newAsset.save().then((doc)=>{
  res.send(doc);
}).catch((e)=>res.status(400).send(doc));
});

app.get('/asset/:id',(req,res)=>{
  if(ObjectID.isValid(req.params.id)){
    Asset.findById({_id:req.params.id}).then((doc)=>{
      if(!doc)
        res.status(400).send();
      res.send(doc);
    }).catch((e)=>res.status(400).send());
  }
  else{
    res.status(400).send();
  }
});

app.get('/assets',(req,res)=>{
Asset.find({}).then((docs)=>{
  res.send(docs);
}).catch((e)=>res.status(400).send());
});

app.patch('/asset/:id',(req,res)=>{
  //we used the lodash to get the price only from the requestbody
  var body = _.pick(req.body,['price']);

  if(ObjectID.isValid(req.params.id)){
    Asset.findByIdAndUpdate({_id:req.params.id},{$set: body},{new:true}).then((doc)=>{
      if(!doc)
        res.status(400).send();
      res.send(doc);
    }).catch((e)=>res.status(400).send());
  }
  else{
    res.status(400).send();
  }
});

app.post('/user/signup',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  //the attribute you but into new User() is an object and the body is already an object so you don't
  //need to put {} around it we just need to put it as itself
  var user = new User(body);
  user.save().then(()=>{
    return user.getAuthToken();
  }).then((token)=>{
    res.header('x-auth',token).send(user);
  }).catch((e)=>res.status(400).send(e));
});
/*
we return user.getAuthToken() because we inside then and we will chain into
promises so to chain on it you need to return the promise inside another promise
*/
app.post('/user/login',(req,res)=>{
  var body = _.pick(req.body,['email','password']);

  User.findByCredentials(body.email,body.password).then((user)=>{
    return user.getAuthToken().then((token)=>{
      res.header("x-auth",token).send(user);
    });
  }).catch((e)=>res.status(400).send(e));
});
/*
so here we need to know which user's token will be removed
so we need to make this path as a private path as each user has it's own
logout. and to decide which user we will mad a middleware a new layer that we decide
by it which user will apply this path and save it in the request and it's token also
*/
app.delete('/user/logout',authenticate,(req,res)=>{
  req.user.removeToken(req.token).then(()=>{
    res.status(200).send();
  }).catch((e)=>res.status(400).send());
});

app.listen(3000,()=>{
  console.log('connect to the server');
});

module.exports = {app};
