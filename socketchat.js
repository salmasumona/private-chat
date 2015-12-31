'use strict';
//var errors = require('./components/errors');
module.exports = function(io,usernames,showusernames,usersmessages) {
	var config  = require("./config");
	var jwt     = require("jsonwebtoken");
	var socketioJwt = require('socketio-jwt');
	var dbc = config.mongoUri;

	//verify authentication 
	io.sockets.on('connection', socketioJwt.authorize({
	    secret: config.JWT_SECRET,
	    timeout: 15000 // 15 seconds to send the authentication message
	  	})).on('authenticated', function(socket) {
		socket.on('adduser', function(username){
			socket.username = username;
			usernames[username] = socket.id;
			io.sockets.emit('user', usernames);  
		});
		// to show all socket connected users
		socket.on('showuser', function(username){
			showusernames[username] = username;
			io.sockets.emit('usershow', usernames); 
			 
		});
		// disconnect user from socket when user logged out and remove that user info from array
		socket.on('removeser', function(username){
			delete usernames[socket.username];		
			delete showusernames[socket.username];		
			io.sockets.emit('user', usernames);
			
		});

		// get request and send db stored private message when page load of 
		socket.on('private_chat_history', function(data){
			
			var private_chat = dbc.collection('private_chat');		
			
			private_chat.find( {
			    $or : [
			        { $and : [ { sender:data.sender }, { to:data.receiver } ] },
			        { $and : [ { sender:data.receiver }, { to:data.sender } ] }
			    ]
			} ,function(err,docs){
				var id  = usernames[data.sender];

				io.to(id).emit('private_chat_history', docs); 
			});
		});
		// get request for private message from one user to another
		// send response to both sender and receiver
		socket.on('private message', function (data) {
			
			var to = data.to;
			var id  = usernames[data.to];
			var sender  = usernames[data.sender];
			/*usersmessages.push(data);
			console.log(usersmessages);*/
			io.to(id).emit('pm1', data);	
			io.to(sender).emit('pm', data);
			/*setTimeout(function () {
			  	var private_chat = dbc.collection('private_chat');		
				private_chat.insert(data,function(err,docs){
					usersmessages=[];
				});
			}, (1000*60*10));	*/
			var private_chat = dbc.collection('private_chat');		
			private_chat.insert(data,function(err,docs){
			});
					
		});

	});

};