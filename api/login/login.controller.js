var express = require("express");
var app   = express();
var config  = require("../../config");

var dbc = config.mongoUri;
var jwt     = require("jsonwebtoken");
var bcrypt  = require("bcryptjs");

/*
*
* Check user already exists or not
* If exists then return "Exixts" message
* Otherwise insert username into Db and return "Save" message
*
*/

exports.login = function(req,res){

  var userCollection = dbc.collection('users');
  var token = jwt.sign(req.body.username, config.JWT_SECRET, { expiresIn: 144000 }) ;
  req.body.token = token;
  if(req.body.username!="" && req.body.username.length>=4 && req.body.password!=undefined){
    userCollection.find({username:req.body.username},function(err,doc){

      if(doc==''){ 
        var salt = bcrypt.genSaltSync(10);
        var hash = bcrypt.hashSync(req.body.password, salt);
        //var hash = bcrypt.hashSync(req.body.password);
        req.body.password = hash;
        userCollection.insert(req.body,function(err,docs){
          res.json({username:docs.username,token:token});
        });
      }else{
        var comparePass = bcrypt.compareSync(req.body.password, doc[0].password);
        if(doc[0].username==req.body.username && !comparePass){
          userCollection.findAndModify({query:{username:req.body.username},update:{$set:{token:token}},new:true},function(err,doc){ 
          });
          res.json("Exists");
          
        }if(doc[0].username==req.body.username && comparePass /*doc[0].password==req.body.password*/){
          //res.json("Login");
          userCollection.findAndModify({query:{username:req.body.username},update:{$set:{token:token}},new:true},function(err,doc){ 
          });
          res.json({username:doc[0].username,token:token});        
        }
        if(doc[0].username!=req.body.username){
          userCollection.insert(req.body,function(err,docs){
            res.json({username:docs.username,token:token});
          });
        }
        
      }

    });
  }else{
      res.json("Empty");
  }
};