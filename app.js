const express = require("express");
const app = express();
const mongo = require("mongodb");
var MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectID;
var url = "mongodb://localhost:27017/ashu";
const cors = require("cors");
const bodyParser = require("body-parser"); 
app.use(bodyParser.json(),cors());
var dbo;
MongoClient.connect(url,{ useUnifiedTopology: true } , function(err, db) {
    if (err) throw err;
    dbo = db.db("ashu");
});    

app.get('/form',(req,res)=>{
        dbo.collection("customers").find({}).toArray((err, res1) =>{
          if (err)  res.send({message:err.message});
          else {
              res.send(res1);
            }
        });
});

app.post('/form',(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const myobj = req.body;
        dbo.collection("customers").insertMany(myobj,(err, res1) =>{
          if (err)  res.send({message:err.message});
          else {
              res.send(res1);
            }
        });
});

app.put('/form',(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const myobj = req.body;  
    var newvalues = { $set: {name: myobj.name, phone:myobj.phone,address: myobj.address } };
        dbo.collection("customers").updateOne({_id:ObjectId(myobj._id)},newvalues,(err, res1) =>{
          if (err)  res.send({message:err.message});
          else {
              res.send(res1);             
            }
        });
});


app.delete('/form/:id',(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const myobj = req.body;  
        dbo.collection("customers").deleteOne({_id:ObjectId(req.params.id)},(err, res1) =>{
          if (err) { res.send({message:err.message}); }
          else {
              res.send(res1);    
              //console.log(req.params.id);         
            }
        });
});


app.post('/search',(req, res)=>{
    res.setHeader('Access-Control-Allow-Origin', '*');
    const myobj = req.body;
    //const txt = myobj.search.
    dbo.collection("customers").find({$or :[{name:new RegExp(myobj.search)}, {phone:new RegExp(myobj.search)}, {address:new RegExp(myobj.search)}]}).toArray((err, result) =>{
      if (err)  res.send({message:err.message});
      else {
          res.send(result);
        }
    });
});


app.listen(3000);