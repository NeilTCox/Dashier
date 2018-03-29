var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('we hit the homepage route');
  if (typeof req.user !== 'undefined') {
    res.render('dashboard', {
      loggedUser: res.locals.user
    });
  } else {
    res.render('index');
  }
});

module.exports = router;