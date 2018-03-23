var models = require('../models');
var express = require('express');
var db = require('../models/index.js');
var router = express.Router();

router.post('/join', function(req, res, next) {
  db.sequelize.query(
    'INSERT INTO "Users" (username, password, dashaddress) VALUES (:username, :password, :address)', {
      replacements: {
        username: req.body.joinUsername,
        password: req.body.joinPassword,
        address: req.body.joinDashAddress
      },
      type: db.sequelize.QueryTypes.INSERT
    }
  ).then(function(user) {
    console.log(user);
    res.render("/");
  }).catch(function(err) {
    //username already taken
    res.redirect("https://yahoo.com");
    return console.error(err);
  });
});

router.post('/login', function(req, res, next) {
  db.sequelize.query(
    'SELECT * FROM "Users" WHERE username = :username', {
      replacements: {
        username: req.body.loginUsername,
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  ).then(function(user) {
    if (user.length !== 0) { // user never longer than 1 beacuse of username uniqueness
      //username exists, now verify password!!!!!!!!!
      console.log(user[0].password);
      res.render('dashboard');
    } else {
      //user does not exist
      console.log('H E k');
      res.redirect('https://yahoo.com');
    }
  });
});

module.exports = router;