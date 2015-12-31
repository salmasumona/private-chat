var myApp = angular.module('loginApp',['ngCookies']);

myApp.controller('Logintrl',['$scope','$http','$window','$cookieStore',function($scope,$http,$window,$cookieStore){
	
	$scope.message = "Please enter your username and password for login or registration.";
	$scope.login = function(){
			if($scope.user!=undefined){
				console.log($scope.user);
				if($scope.user.username!="" && $scope.user.username.length>=4 && $scope.user.password!=""){
								$http.post("/api/login/adduser",$scope.user).success(function(response){
									console.log(response);
									if(response=="Exists"){
										$scope.message = "Username already exists.If you have registered by this username then please enter correct username and password, otherwise choose please choose another!";
									}else if(response=="Empty"){
										$scope.message = "Please enter your username and password. These fields can not be empty.";

									}
									else{
										console.log(response);
										/*$scope.checkCookie();
										var user=$scope.getCookie("username");*/
										$cookieStore.put('username', response.username);
										$cookieStore.put('token', response.token);
									    var users = $cookieStore.get('username');
									   // alert(users);
									    if (users != ""){
									        $window.location.href = "/privatechat.html";
									    }
			
										
									}
								});
						}else if($scope.user.username=="" || $scope.user.password==""){
							$scope.message = "Please enter your username and password. These fields can not be empty.";
			
						}else if($scope.user.username.length<4){
							$scope.message = "Username minimum length 4. ";
			
						}
					}
			//alert($scope.user);
		};
	


	
	
}]);