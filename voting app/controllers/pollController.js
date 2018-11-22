const _ = require('lodash');
var {mongoose} = require('./../models/db/mongoose');
var {Poll} = require('./../models/poll');
var {authenticate} = require('./../middleware/authenticate');
var {ObjectID} = require('mongodb');

module.exports = function(app){
  app.get('/createPoll',(req,res)=>{
    res.render('createPoll');
  });
//-----------autenticated user------------
  app.post('/createPoll',authenticate,(req,res)=>{
    body = _.pick(req.body,['name','options']);
    var poll = new Poll(body);
    poll.creator = req.user._id;
    poll.save().then((poll)=>{
      res.status(200).send(poll);
    }).catch((e)=>{res.status(400).send()});
  });

app.post('/newOption/:id',authenticate,(req,res)=>{
  id = req.params.id;
  body = _.pick(req.body,['name']);
  if(ObjectID.isValid(id)){
   Poll.findOneAndUpdate({_id:id},{$addToSet:{options:{"name":body.name}}},{returnOriginal:false}).then((poll)=>{
     res.send(poll);
   }).catch((e)=>{res.status(400).send()});
  }
  else{
    res.status(400).send();
  }
});

app.delete('/delete/poll/:id',authenticate,(req,res)=>{
  id = req.params.id;
  Poll.findById({_id:ObjectID(id)}).then((poll)=>{
    return poll.checkAccess(req.user).then(()=>{
      poll.remove({_id:ObjectID(id)}).then(()=>{
          res.send();
      })
    })
  }).catch((e)=>{res.status(400).send()});
});
//-----------unautenticated user------------
  app.get('/publishPoll/:id',(req,res)=>{
    id = req.params.id;
    if(ObjectID.isValid(id)){
      Poll.findById(id).then((poll)=>{
        if(!poll)
         Promise.reject();
         res.render('publishPoll',{poll});
      }).catch((e)=>{
        res.render('publishPoll',{'message':'Poll doesn\'t exist'});
      })
    }
    else{
        res.render('publishPoll',{'message':'Poll doesn\'t exist'});
    }

  });

//didn't update the result
  app.post('/vote/:id',(req,res)=>{
    id =  req.params.id;
    body = _.pick(req.body,['option']);
    if(ObjectID.isValid(id)){
      Poll.findById(id).then((poll)=>{
        if(!poll)
          Promise.reject();
        poll.options.forEach((pollOption)=>{
          if(body.option == pollOption.name ){
            pollOption.votes+=1;
            poll.save().then((savedPoll)=>{
              res.send(savedPoll);
            });
          }
        });
      }).catch((e)=>{res.status(400).send()})
    }
    else{
      res.status(401).send();
    }
  });

  app.get('/polls',(req,res)=>{
    Poll.find({}).then((polls)=>{
      if(!polls)
        Promise.reject();
      res.send(polls);
    }).catch((e)=>{res.status(400).send()});
  })
}
