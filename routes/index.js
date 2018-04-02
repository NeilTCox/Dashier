var models = require('../models');
var express = require('express');
var router = express.Router();
var db = require('../models/index.js');

router.get('/', function(req, res, next) {
  console.log('we hit the homepage route');
  if (typeof req.user !== 'undefined') {
    db.sequelize.query(
      'SELECT * FROM "Users" WHERE username = :username', {
        replacements: {
          username: res.locals.user.username,
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    ).then(function(user) {
      console.log(user[0].friends);
      console.log(user[0].following);
      db.sequelize.query(
        'SELECT * FROM "Posts" WHERE SENDER IN :friends OR RECIPIENT IN :friends', {
          replacements: {
            friends: [user[0].friends],
          },
          type: db.sequelize.QueryTypes.SELECT
        }
      ).then(function(posts) {
        res.render('dashboard', {
          loggedUser: res.locals.user,
          postList: posts
        });
      });
    });
  } else {
    res.render('index');
  }
});

module.exports = router;