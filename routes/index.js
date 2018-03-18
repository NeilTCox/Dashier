var models = require('../models');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('we hit the homepage route');
  res.render('index');
});

module.exports = router;