var express = require("express");
var app   = express();
//var passport = require('passport');
//var passportLocal = require('passport-local');
var config  = require("../../config");

var dbc = config.mongoUri;
//var dbc = mongojs("mongodb://sumona:sumona123@ds027385.mongolab.com:27385/userchat",["userchat"], {authMechanism: 'ScramSHA1'});
var jwt     = require("jsonwebtoken");
var bcrypt  = require("bcryptjs");


/*var bodyParser = require("body-parser");
app.use(bodyParser.json());*/

/* passport.use(new passportLocal.Strategy(function(username,password,next){
    var userCollection = dbc.collection('users');
  
    userCollection.find({username:username},function(err,doc){

      if(doc==''){

        req.body.token = jwt.sign(req.body, config.JWT_SECRET);
        userCollection.insert(req.body,function(err,docs){
          return next({username:docs.username});
        });
      }else{
        if(doc[0].username==username && doc[0].password!=password){
          return next("Exists");
          
        }if(doc[0].username==username && doc[0].password==password){
          //next("Login");
          return next({username:doc[0].username});        
        }
        if(doc[0].username!=username){
          userCollection.insert(req.body,function(err,docs){
            return next({username:docs.username});
          });
        }
        
      }

    });
  }));

  passport.serializeUser(function(user,next){
    console.log('user---',user);
    next(null,user.username);
  });
  passport.deserializeUser(function(username,next){
    var userCollection = dbc.collection('users');
  
    userCollection.find({username:username},function(err,doc){
       if(doc==''){

        req.body.token = jwt.sign(req.body, config.JWT_SECRET);
        userCollection.insert(req.body,function(err,docs){
          next({username:docs.username,token:docs.token});
        });
      }else{
        if(doc[0].username==username && doc[0].password!=password){
          next("Exists");
          
        }if(doc[0].username==username && doc[0].password==password){
          //next("Login");
          next({username:doc[0].username,token:doc[0].token});        
        }
        if(doc[0].username!=username){
          userCollection.insert(req.body,function(err,docs){
            next({username:docs.username,token:docs.token});
          });
        }
        
      }
    });
  });*/

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
  console.log(req.body);
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
              console.log(doc);
          });
          res.json("Exists");
          
        }if(doc[0].username==req.body.username && comparePass /*doc[0].password==req.body.password*/){
          //res.json("Login");
          userCollection.findAndModify({query:{username:req.body.username},update:{$set:{token:token}},new:true},function(err,doc){ 
              console.log(doc);
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