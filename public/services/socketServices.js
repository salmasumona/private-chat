/**
*	wrap the socket object returned by Socket.IO
* 	

**/

myApp.factory('socket', function ($rootScope) {
  /*var socket = io.connect('http://localhost:1600', {
          'query': 'token=' + token});;*/
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {  
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});