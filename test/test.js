var chai = require('chai'),
	should = chai.should(),
	expect = chai.expect(),
	server = ('../server'),
	io = require('socket.io/node_modules/socket.io-client'),
    ioOptions = { 
      transports: ['websocket']
    , forceNew: true
    , reconnection: false
  },
  sender,
  receiver,
  jwt     = require("jsonwebtoken"),
  config  = require("../config");

var socketURL = config.url;
console.log(config.mongoUri);
var user1 = {'username':'A'};
var user2 = {'username':'B'};
var user3 = {'username':'C'};
var user4 = {'username':'D'};

	/*describe('test 1', function(){
		it('Testing');
	});*/
/*describe('Chat Events', function(){
	  beforeEach(function(done){
	    
	    // start the io server
	    server.start()
	    // connect two io clients
	    sender = io(socketURL, ioOptions)
	    receiver = io(socketURL, ioOptions)
	    
	    // finish beforeEach setup
	    done()
	  });
	  afterEach(function(done){
	    
	    // disconnect io clients after each test
	    sender.disconnect()
	    receiver.disconnect()
	    done()
	  });
	  */

	describe("Chat Server Connect",function(){
	
		  it('New user connect',function(done){
		  	var count = 0;
		  	var new_userchack = function(user){ 
		  	
		  	 var token = jwt.sign(user.username, config.JWT_SECRET, { expiresIn: 144000 }) ; 	
			 var client = io.connect(socketURL+'?token='+token, {'forceNew': true});

			    client.on('connect',function(data){
			      client.emit('adduser',user.username);
			    });

			    client.on('user',function(usersName){
			    	count++;
			    	var uname = user.username;			    	
			    	if(usersName.hasOwnProperty(uname)){ 
			    		console.log('====',usersName);
			    		uname.should.be.a('string');
			      		uname.should.equal(user.username);
			      	}else{
			    		var uname = user.username;
			    		console.log('Exists')};
			    		uname.should.be.a('string');
			      		uname.should.equal(user.username);
			     
			      client.disconnect();
			      if(count===2) done(); 
			    });
			  };

		   
		    this.timeout(10000);
		    new_userchack(user1);		    
		    new_userchack(user2);
		    new_userchack(user3);
		    new_userchack(user4);
		    
		  });
		  it('Private Message to Sender and Receiver',function(done){
		  	var count = 0;
		  	var send_message = function(data,client,emitTitle){ 
			  		
				    client.on(emitTitle,function(val){
				    	  count++;
				  		  var sender = data.sender;
					      var to = data.to;
					      var message = data.textMsg;
					      console.log('===',data);	
					      message.should.equal(message);
					      sender.should.equal(client);
					      client.disconnect();
					      if(count===2) done(); 
				    });
			};
		  	var private_message = function(data,client1,client2){ 
			    client1.on('connect',function(val){
			      client1.emit('private message',data);
			    });
			    send_message(data,client1,'pm');
			    send_message(data,client2,'pm1');
			    done();
			};
			var getDate = function(){
				var d=new Date();
				var month	=	parseInt(d.getMonth())+ parseInt(1);
				var n=d.toLocaleTimeString()+' '+d.getFullYear() + "/" + month + "/" + d.getDate();
				return n;
			}
			
			var client1 = io.connect(socketURL, ioOptions);
		 	var client2 = io.connect(socketURL, ioOptions);  

		    var msg = "Hello!";
		    var data = {sender:user1,to:user2,textMsg:msg,time:getDate()};		    
		    
		    private_message(data,client1,client2);
		    this.timeout(10000);
		    
		  });

  	});
//});