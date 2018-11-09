

const express = require('express');

var app = express();

app.get(/api\/timestamp\/(.*)/,(req,res)=>{
  dateParameter = req.params[0];
  if(dateParameter === '')
    date = new Date();
 else if(!isNaN(parseInt(dateParameter)))
    date = new Date(parseInt(dateParameter));
 else
    date = new Date(dateParameter)
  //isNaN will convert the date into number if it converted to NaN it won't
  //be a date if it converted to the number it will be the date in milliseconds d.getTime just isNan(d)
  if(date instanceof Date && !isNaN(date)){
    object = {
      "unix": date.getTime(),
      "utc": date.toUTCString()
    }
    res.send(object);
  }
  else{
    res.status(400).send('invalid Date');
  }
});

app.listen("3000");
