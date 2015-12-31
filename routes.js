'use strict';
/**
 * Main application routes
 */


//var errors = require('./components/errors');
module.exports = function(app) {

  // Insert routes below
  app.use('/api/login', require('./api/login'));

  
};
