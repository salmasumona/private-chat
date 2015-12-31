'use strict';
var mongojs = require("mongojs");
//module for check client is local host or not
var os = require('os');
var config = {};

if(os.hostname().indexOf("local") > -1){
 	  config.mongoUri = mongojs("mongodb://sumona:sumona123@ds027385.mongolab.com:27385/userchat",["userchat"], {authMechanism: 'ScramSHA1'});
 	  config.port = process.env.PORT || 1600;
 	  config.url = 'http://floating-cove-7182.herokuapp.com/';	
}
else{
	  config.mongoUri = mongojs("userchat",["userchat"]);
	  config.port = 1600;
	  config.url = 'http://localhost:1600';
}

config.JWT_SECRET="mySecrets";


module.exports = config;