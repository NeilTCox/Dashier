var models = require('../models');
var express = require('express');
var router = express.Router();
var db = require('../models/index.js');

router.get('/', function(req, res, next) {
  console.log('we hit the homepage route');
  if (typeof req.user !== 'undefined') {
    db.sequelize.query(
      'SELECT * FROM "Posts" WHERE SENDER IN (SELECT ALL username FROM "Users" WHERE ID IN (SELECT ALL followed FROM "FollowerFollowed" WHERE (FOLLOWED = :local_id AND FRIENDS = true))) OR RECIPIENT IN (SELECT ALL username FROM "Users" WHERE ID IN (SELECT ALL followed FROM "FollowerFollowed" WHERE (FOLLOWED = :local_id AND FRIENDS = true))) ORDER BY ID', {
        replacements: {
          local_id: res.locals.user.id,
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    ).then(function(posts) {
      res.render('dashboard', {
        loggedUser: res.locals.user,
        postList: posts
      });
    });
  } else {
    res.render('index');
  }
});

module.exports = router;