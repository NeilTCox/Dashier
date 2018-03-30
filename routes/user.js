var models = require('../models');
var express = require('express');
var db = require('../models/index.js');
var bcrypt = require('bcrypt');
var router = express.Router();

function checkPassword(given_password, db_password) {
  return bcrypt.compare(given_password, db_password);
}

router.post('/join', function(req, res, next) {
  db.sequelize.query(
    `INSERT INTO "Users" (username, password, dashaddress, following) VALUES (:username, :password, :dashaddress, '{${req.body.joinUsername}}')`, {
      replacements: {
        username: req.body.joinUsername,
        password: models.User.hashPassword(req.body.joinPassword),
        dashaddress: req.body.joinDashAddress
      },
      type: db.sequelize.QueryTypes.INSERT
    }
  ).then(function(user) {
    console.log(user);
    res.redirect("/");
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
    if (user[0]) { // user never longer than 1 beacuse of username uniqueness
      checkPassword(req.body.loginPassword, user[0].password).then(function(result) {
        if (result) {
          console.log('im before');
          req.session.user = user[0];
          console.log('im after');
        }
        console.log('password correct!');
        res.status(200).redirect('/');
      }).catch(function(err) {
        console.log('errored checkPassword');
        console.error(err);
        res.status(500).send(err);
      });
    } else {
      //user does not exist
      console.log('H E k, user does not exist');
      res.redirect('https://yahoo.com');
    }
  });
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.redirect('/');
});

router.get('/:username', function(req, res, next) {
  //display proper user's profile
});

module.exports = router;