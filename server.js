var express = require("express");
var app = express();
var mongojs = require("mongojs");
//var db = mongojs("contactlist",["contactlist"]);
/*if(process.env.NODE_ENV==='development'){
	var dbc = mongojs("userchat",["userchat"]);
}else{, {authMechanism: 'ScramSHA1'}*/
	var dbc = mongojs("mongodb://sumona:sumona123@ds027385.mongolab.com:27385/userchat",["userchat"], {authMechanism: 'ScramSHA1'});

//}

//var dbc = mongojs("userchat",["userchat"]);
var bodyParser = require("body-parser");
// mongodb://userchat:sumona123@ds027385.mongolab.com:27385/userchat

var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = 3000;
var usernames={};
var showusernames={};
/*app.get("/",function(req,res){
	res.send("Hello");
});*/

app.use(express.static(__dirname + "/public"));
//app.use(express.static("https://floating-cove-7182.herokuapp.com/public"));

app.use(bodyParser.json());

/*
*
*	Check user already exists or not
*	If exists then return "Exixts" message
*	Otherwise insert username into Db and return "Save" message
*
*/
app.post('/adduser',function(req,res){
	var userCollection = dbc.collection('users');
	
	userCollection.find({username:req.body.username},function(err,doc){

		if(doc==''){
			userCollection.insert(req.body,function(err,docs){
				res.json("Saved");
			});
		}else{
			if(doc[0].username==req.body.username && doc[0].password!=req.body.password){
				res.json("Exists");
				
			}if(doc[0].username==req.body.username && doc[0].password==req.body.password){
				res.json("Login");
			}
			if(doc[0].username!=req.body.username){
				userCollection.insert(req.body,function(err,docs){
					res.json("Saved");
				});
			}
			
		}

	});
});
//http.listen(3000);
http.listen(process.env.PORT || 3000);
console.log("Server is running on port "+process.env.PORT);
io.sockets.on('connection', function (socket) {
	//use associative array to add socket id into each users username..Here key is username and value is socketId	
	socket.on('adduser', function(username){
		socket.username = username;
		usernames[username] = socket.id;
		console.log(username+"-------"+socket.id);
		io.sockets.emit('user', usernames);  
	});
	// to show all socket connected users
	socket.on('showuser', function(username){
		showusernames[username] = username;
		/*var userCollection = dbc.collection('users');		
		userCollection.find(function(err,doc){
			io.sockets.emit('usershow', doc); 
		});*/
		io.sockets.emit('usershow', usernames); 

		 
	});
	// disconnect user from socket when user logged out and remove that user info from array
	socket.on('removeser', function(username){
		delete usernames[socket.username];		
		delete showusernames[socket.username];		
		io.sockets.emit('user', usernames);
		console.log(usernames[socket.username]);
		
	});

	// get request and send db stored private message when page load of 
	socket.on('private_chat_history', function(data){
		
		var private_chat = dbc.collection('private_chat');		
		/*private_chat.find({sender:sender,to:to},function(err,docs){
			io.sockets.emit('private_chat_history', docs); 
		});*/
		private_chat.find( {
		    $or : [
		        { $and : [ { sender:data.sender }, { to:data.receiver } ] },
		        { $and : [ { sender:data.receiver }, { to:data.sender } ] }
		    ]
		} ,function(err,docs){
			var id  = usernames[data.sender];
		
		/*io.sockets.connected[id].emit('pm1', data);	
		io.sockets.connected[sender].emit('pm', data);	*/
			io.to(id).emit('private_chat_history', docs); 
		});
	});
	
	// get request for private message from one user to another
	// send response to both sender and receiver
	socket.on('private message', function (data) {
		
		var to = data.to;
		var id  = usernames[data.to];
		var sender  = usernames[data.sender];
		
		/*io.sockets.connected[id].emit('pm1', data);	
		io.sockets.connected[sender].emit('pm', data);	*/
		io.to(id).emit('pm1', data);	
		io.to(sender).emit('pm', data);	
		var private_chat = dbc.collection('private_chat');		
		private_chat.insert(data,function(err,docs){
			console.log(docs);
		});
				
	});




});
