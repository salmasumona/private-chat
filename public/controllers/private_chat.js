var myApp = angular.module('privateChat',['ngCookies']);

myApp.controller('PrivateChatCtrl',['$scope','$http','$window','$cookieStore','socket',function($scope,$http,$window,$cookieStore,socket){	
	
	var loggeduser = $cookieStore.get('username');
	$scope.to = '';
	$scope.loggeduser = loggeduser;
	var token = $cookieStore.get('token');	
    if((loggeduser == undefined || loggeduser == null) && (typeof token === 'undefined')){
    	 $window.location.href = "/index.html";
    }
    if ((loggeduser != undefined || loggeduser != null || loggeduser != "") && (typeof token !== 'undefined')){

    	socket.on('authenticated', function () {
    		 //send request to add username for a socket connection
        	socket.emit('adduser', loggeduser);
        	$scope.private_chat_history();	
		});	
    	 socket.emit('authenticate', {token: token}); 

        console.log("Welcome  " + loggeduser);
       
        //receive response to add username for a socket connection of request add username
        socket.on('user', function (data) {
			$scope.users = data;
		});	
		/*$window.onbeforeunload = function (evt) {
		    socket.emit('removeser', loggeduser);
		 }*/
		 var pmLast = $cookieStore.get(loggeduser);

		 $scope.to = pmLast;
		 $scope.pmLast = pmLast;

		 $scope.privateMessage = [];
		 // send request for show chat history with last user or selected user
		$scope.private_chat_history = function(){
			socket.emit('private_chat_history', {sender:loggeduser,receiver:$scope.to});
		}
		socket.on('private_chat_history', function (data) {
			$scope.privateMessage = data;
		});
		
		 // request for user list
		socket.emit('showuser', loggeduser);
		// response for user list . currently server sending an array where all connected users name are listed
        socket.on('usershow', function (data) {
			$scope.users = data;
		});	
        // to define receiver username
		$scope.select_user = function(to){
			$scope.to = to;
			$scope.private_chat_history();
		}
		// send request for PM
		
		$scope.send_message = function(){
			$cookieStore.put(loggeduser, $scope.to);
			
			if($scope.private_Message!=''){
				socket.emit('private message', {sender:$scope.loggeduser,to:$scope.to,textMsg:$scope.private_Message,time:$scope.getDate()});
			}	
			$scope.private_Message = '';
			//console.log({name:$scope.loggeduser,to:$scope.to,textMsg:$scope.private_Message,time:$scope.getDate()});
			
		}
		// get response sender and show message to their window
		socket.on('pm', function (data) {
			$scope.to =  data.to ;
			$scope.privateMessage.push(data);
		});
		// get response receiver and show message nto their window
		socket.on('pm1', function (data) {
			$scope.to =  data.sender ;
			//$scope.private_chat_history();	

			$scope.privateMessage.push(data);
		});
    }
    // remove cookie and send request to pop user info from array list
    $scope.logout = function(){
    	var loggeduser = $cookieStore.get('username');
    	var token = $cookieStore.get('token');
    	socket.emit('removeser', loggeduser);
    	$cookieStore.remove('username', loggeduser);
    	$cookieStore.remove('token', token);
    	var disconnectuser = $cookieStore.get('username');
    	if (disconnectuser == undefined || disconnectuser == null){
	        $window.location.href = "/index.html";
	    }
    }
    // get date
    $scope.getDate = function(){
		var d=new Date();
		var month	=	parseInt(d.getMonth())+ parseInt(1);
		var n=d.toLocaleTimeString()+' '+d.getFullYear() + "/" + month + "/" + d.getDate();
		return n;
	}
	
}]);