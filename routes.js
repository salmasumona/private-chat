'use strict';
/**
 * Main application routes
 */


//var errors = require('./components/errors');
module.exports = function(app) {

  // Insert routes below
  app.use('/api/login', require('./api/login'));
  
   app.get('/private_chat',function(req,res){
	  res.sendFile(__dirname + "/public/view/privatechat.html");
	  //It will find and locate index.html from View or Scripts
	});
  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(__dirname + "/public/view/index.html");
    });
 
};
