/*
npm i mocha@1.20.2 nodemon supertest@2.0.0
new update in the package.json file => go to scripts
to run it npm run test-watch
*/

const supertest = require('supertest');
const expect = require('expect');
const {Asset} = require('./../models/asset');
const {app} = require('./../server');
const {ObjectID} = require('mongodb');

// describe('should add new assert or return error',()=>{
//   beforeEach((done)=>{
//     Asset.remove({}).then(()=>done()).catch((e)=>done(e));
//   });
//
//   it('should add new assert',(done)=>{
//     var name = 'youtube',price = 80;
//     supertest(app)
//     .post('/asset')
//     .send({name})
//     .send({price})
//     .expect(200)
//     .expect((res)=>{
//       expect(res.body.name).toBe(name);
//       expect(res.body.price).toBe(price);
//     }).end((err,res)=>{
//       if(err)
//         return done(err);
//       Asset.find().then((asset)=>{
//         expect(asset.length).toBe(1);
//         expect(asset[0].name).toBe(name);
//         expect(asset[0].price).toBe(price);
//         done();
//       }).catch((e)=>done(e));
//     });
//   });
//
//   it('should return error',(done)=>{
//     var name = 'youtube',price = '80';
//     supertest(app)
//     .post('/asset')
//     .send({name})
//     .send({price})
//     .expect(400)
//     .end(done());
//   });
// });


describe('should update asset or return error',()=>{
  const assets = [
    {name:'Google',price:50},
    {name:'Youtube',price:30}
  ]
  beforeEach((done)=>{
    Asset.remove({}).then(()=>{
      Asset.insertMany(assets).then(()=>done());
    }).catch((e)=>done(e));
  });
  it('should update asset',(done)=>{
    var price = 100;
   Asset.findOne({name:'Google'},(err,asset)=>{
     if(err)
        return done(err);
      var id = asset._id;
      //console.log('id', id);
      supertest(app)
      .patch(`/asset/${id.toHexString}`)
      .send({price})
      .expect(200)
      .expect((res)=>{
        expect(res.body.price).toBe(price);
      }).end((err,res)=>{
        if(err)
          return done(err);
        Asset.find().then((assets)=>{
          expect(assets[0].price).toBe(price);
          done();
        }).catch((e)=>done(e));
      });
   });
  });
});
