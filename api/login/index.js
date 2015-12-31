'use strict';

var express = require('express');
var logincontroller = require('./login.controller');

var router = express.Router();

router.post('/adduser',logincontroller.login);

module.exports = router;