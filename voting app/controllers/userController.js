const _ = require('lodash');

var {mongoose} = require('./../models/db/mongoose');
var {User} = require('./../models/user');

module.exports = function(app){

app.get('/signup',(req,res)=>{
  res.render('signup');
});

app.post('/signup',(req,res)=>{
  var body = _.pick(req.body,['name','email','password']);
  var user = new User(body);
  user.save().then(()=>{
    return user.getAuthToken();
  }).then((token)=>{
    res.cookie('token', token, { maxAge: 300000, httpOnly: true });
    res.send(user);
  }).catch((e)=>{
    res.status(401).send();
  });
});

app.get('/login',(req,res)=>{
  //console.log("the token",global.localStorage.getItem('token'));
  res.render('login');
});

app.post('/login',(req,res)=>{
  var body = _.pick(req.body,['email','password']);
  User.findByCrediantels(body.email,body.password).then((user)=>{
    return user.getAuthToken().then((token)=>{
      res.cookie('token', token, { maxAge: 86400, httpOnly: true });
      res.send(user);
    });
  }).catch((e)=>res.status(400).send());
});

app.get('/testCookie',(req,res)=>{
  console.log('cookies: ',req.cookies);
});
app.get('/deleteCookie',(req,res)=>{
  res.clearCookie('token');
});
}
