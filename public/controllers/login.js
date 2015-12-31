var myApp = angular.module('loginApp',['ngCookies']);

myApp.controller('Logintrl',['$scope','$http','$window','$cookieStore',function($scope,$http,$window,$cookieStore){
	
	$scope.message = "Please enter your username and password for login or registration.";
	$scope.login = function(){
		if($scope.user.username!=""){
			$http.post("/adduser",$scope.user).success(function(response){
				if(response=="Exists"){
					$scope.message = "Username already exists.If you have registered by this username then please enter correct username and password, otherwise choose please choose another!";
				}else{
					/*$scope.checkCookie();
					var user=$scope.getCookie("username");*/
					$cookieStore.put('username', $scope.user.username);
				    var users = $cookieStore.get('username');
				   // alert(users);
				    if (users != ""){
				        $window.location.href = "/privatechat.html";
				    }

					
				}
			});
			//alert($scope.user);
		};
	}else{
		$scope.message = "Please enter your username and password. These fields can not be empty.";

	}


	
	
}]);