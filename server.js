var express = require("express");
var app 	= express();
//var mongojs = require("mongojs");

var config  = require("./config");
//var passport = require('passport');
//var expressSession = require('express-session');


var dbc = config.mongoUri;
var port = config.port;
var bodyParser = require("body-parser");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernames={};
var showusernames={};
var usersmessages=[];
/*app.get("/",function(req,res){
	res.send("Hello");
});*/

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
// for passport auth
/*app.use(expressSession({
	secret:config.JWT_SECRET,
	saveUninitialized:false,
	resave:false
}));
app.use(passport.initialize());
app.use(passport.session());*/
require('./routes')(app);


http.listen(port);
//http.listen(process.env.PORT || 3000);
console.log("Server is running on port "+port);
require('./socketchat.js')(io,usernames,showusernames,usersmessages);
