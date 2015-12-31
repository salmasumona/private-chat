'use strict';
var express = require("express");
var app 	= express();

var config  = require("./config");

var dbc = config.mongoUri;
var port = config.port;
var bodyParser = require("body-parser");
var http = require('http').Server(app);
var io = require('socket.io')(http);
var usernames={};
var showusernames={};
var usersmessages=[];

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
require('./routes')(app);

http.listen(port);
//http.listen(process.env.PORT || 3000);
console.log("Server is running on port "+port);
require('./socketchat.js')(io,usernames,showusernames,usersmessages);
