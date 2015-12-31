'use strict';

var express = require('express');
var logincontroller = require('./login.controller');

var router = express.Router();

router.post('/adduser',logincontroller.login);
//router.post('/adduser',passport.authenticate('local'),logincontroller.login);


module.exports = router;