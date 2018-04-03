var models = require('../models');
var express = require('express');
var router = express.Router();
var db = require('../models/index.js');

router.get('/', function(req, res, next) {
  console.log('we hit the homepage route');
  if (typeof req.user !== 'undefined') {
    // //testing query
    // db.sequelize.query(
    //   'SELECT ALL followed FROM "FollowerFollowed" WHERE (FOLLOWER = :local_id AND FRIENDS = true)', {
    //     replacements: {
    //       local_id: res.locals.user.id,
    //     },
    //     type: db.sequelize.QueryTypes.SELECT
    //   }
    // ).then(function(results) {
    //   console.log(JSON.stringify(results));
    // });
    db.sequelize.query(
      'SELECT * FROM "Posts" WHERE SENDER IN (SELECT ALL username FROM "Users" WHERE ID IN (SELECT ALL followed FROM "FollowerFollowed" WHERE (FOLLOWER = :local_id AND FRIENDS = true))) OR RECIPIENT IN (SELECT ALL username FROM "Users" WHERE ID IN (SELECT ALL followed FROM "FollowerFollowed" WHERE (FOLLOWER = :local_id AND FRIENDS = true))) ORDER BY ID', {
        replacements: {
          local_id: res.locals.user.id,
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    ).then(function(posts) {
      res.render('dashboard', {
        loggedUser: res.locals.user,
        postList: posts,
        message: ''
      });
    });
  } else {
    //user not logged in
    res.render('index', {
      message: ''
    });
  }
});

module.exports = router;