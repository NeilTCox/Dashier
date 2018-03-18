var models = require('../models');
var express = require('express');
var router = express.Router();

router.post('/join', function(req, res, next) {
  console.log('in join!');
  models.User.create({
    username: req.body.joinUsername,
    password: req.body.joinPassword,
    dashaddress: req.body.joinDashAddress
  }).then(function() {
    res.redirect("https://google.com");
  }).fail(function(err) {
    console.log("I failed!");
    console.error(err);
  });
});

router.post('/login', function(req, res, next) {

});

module.exports = router;