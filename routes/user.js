var models = require('../models');
var express = require('express');
var db = require('../models/index.js');
var io = require('../io');
var bcrypt = require('bcrypt');
var HTTPStatus = require('http-status');
var router = express.Router();

function checkPassword(given_password, db_password) {
  return bcrypt.compare(given_password, db_password);
}

router.post('/join', function(req, res, next) {
  const {
    joinUsername,
    joinEmail,
    joinPassword
  } = req.body;

  if (!joinUsername) return res.status(HTTPStatus.BAD_REQUEST).send('username is required');
  if (!joinEmail) return res.status(HTTPStatus.BAD_REQUEST).send('email is required');
  if (!joinPassword) return res.status(HTTPStatus.BAD_REQUEST).send('password is required');

  const initial_balance = 100;

  db.sequelize.query(
    // OLD QUERY `INSERT INTO "Users" (username, password, dashaddress, privatekey, friends, following) VALUES (:username, :password, :dashaddress, :privatekey, '{${req.body.joinUsername}}', '{}')`
    `INSERT INTO "Users" (username, email, password, balance) VALUES (:username, :email, :password, :balance)`, {
      replacements: {
        username: req.body.joinUsername,
        email: req.body.joinEmail,
        password: models.users.hashPassword(req.body.joinPassword),
        balance: initial_balance, // TODO: auto generate free transaction
        // dashaddress: req.body.joinDashAddress,
        //privatekey: req.body.privateKey
      },
      type: db.sequelize.QueryTypes.INSERT
    }
  ).then(function(user) {
    console.log(user);
    req.session.user = user;
    res.status(200).redirect("/");
  }).catch(function(err) {
    //username already taken
    res.status(400).render("index", {
      message: "username already taken :("
    });
  });
});

router.post('/login', function(req, res, next) {
  db.sequelize.query(
    'SELECT * FROM "Users" WHERE username = :username', {
      replacements: {
        username: req.body.loginUsername
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  ).then(function(user) {
    if (user[0]) { // user never longer than 1 beacuse of username uniqueness
      checkPassword(req.body.loginPassword, user[0].password).then(function(result) {
        if (result) {
          req.session.user = user[0];
          res.status(200).redirect('/');
        } else {
          res.status(401).render('index', {
            message: "password incorrect!"
          });
        }

      });
    } else {
      //user does not exist
      res.status(404).render('index', {
        message: "username does not exist :O"
      });
    }
  });
});

router.post('/changepassword', function(req, res, next) {
  db.sequelize.query(
    `UPDATE "Users" SET password = :password WHERE username = :username`, {
      replacements: {
        username: res.locals.user.username,
        password: models.User.hashPassword(req.body.newPassword)
      },
      type: db.sequelize.QueryTypes.UPDATE
    }
  ).then(function(user) {
    res.status(200).redirect("/");
  }).catch(function(err) {
    console.log(err);
    res.status(500).send(err);
  });
});

router.get('/logout', function(req, res) {
  req.session.reset();
  res.status(200).redirect('/');
});

router.get('/:username', function(req, res, next) {
  //display user's profile
  var current_relationship = '';
  if (typeof req.user !== 'undefined') {
    //get other_id
    db.sequelize.query(
      'SELECT * FROM "Users" WHERE username = :username', {
        replacements: {
          username: req.params.username,
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    ).then(function(user) {
      //if user exists
      if (user.length > 0) {
        //get relationships between this user and local user
        db.sequelize.query(
          'SELECT * FROM "FollowerFollowed" WHERE (FOLLOWER = :local_id AND FOLLOWED = :other_id) OR (FOLLOWER = :other_id AND FOLLOWED = :local_id)', {
            replacements: {
              local_id: res.locals.user.id,
              other_id: parseInt(user[0].id)
            },
            type: db.sequelize.QueryTypes.SELECT
          }
        ).then(function(relationships) {
          if (res.locals.user.username == req.params.username) {
            current_relationship = 'self';
          } else if (relationships.length == 1 && relationships[0].follower == res.locals.user.id) {
            current_relationship = 'following';
          } else if (relationships.length == 2) {
            current_relationship = 'friend';
          }
          db.sequelize.query(
            'SELECT * FROM "Posts" WHERE SENDER = :username OR RECIPIENT = :username ORDER BY ID', {
              replacements: {
                username: req.params.username,
              },
              type: db.sequelize.QueryTypes.SELECT
            }
          ).then(function(posts) {
            res.status(200).render('profile', {
              givenUser: user[0],
              postList: posts,
              relationship: current_relationship,
              localUser: res.locals.user,
            });
          });
        });
      } else {
        //user does not exist
        res.redirect('https://github.com/404');
      }
    });
  } else {
    //you must sign up to see other users
    res.status(403).render('index', {
      message: '↖ please login view your friends!'
    });
  }
});

router.post('/:userid/follow', function(req, res, next) {
  var already_followed_by_them = false;
  db.sequelize.query(
    'SELECT * FROM "FollowerFollowed" WHERE FOLLOWER = :other_id AND FOLLOWED = :local_id', {
      replacements: {
        local_id: res.locals.user.id,
        other_id: parseInt(req.params.userid)
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  ).then(function(relationship) {
    if (relationship.length > 0) {
      already_followed_by_them = true;

      db.sequelize.query(
        `INSERT INTO "FollowerFollowed" (friends, follower, followed) VALUES (:friends, :local_id, :other_id)`, {
          replacements: {
            friends: true,
            local_id: res.locals.user.id,
            other_id: parseInt(req.params.userid)
          },
          type: db.sequelize.QueryTypes.INSERT
        }
      ).then(function(posts) {
        //since other user is already following, update friends column in other direction
        db.sequelize.query(
          `UPDATE "FollowerFollowed" SET friends = true WHERE (FOLLOWER = :other_id AND FOLLOWED = :local_id)`, {
            replacements: {
              friends: true,
              local_id: res.locals.user.id,
              other_id: parseInt(req.params.userid)
            },
            type: db.sequelize.QueryTypes.UPDATE
          }
        ).then(function() {
          //join socket & they are friends now since both are following each other
          io.socket().join(parseInt(req.params.userid));
          res.status(200).send(true);
        });
      }).catch(function(err) {
        console.error(err);
      });
    } else {
      //other user was not following local user already
      db.sequelize.query(
        `INSERT INTO "FollowerFollowed" (friends, follower, followed) VALUES (:friends, :local_id, :other_id)`, {
          replacements: {
            friends: false,
            local_id: res.locals.user.id,
            other_id: parseInt(req.params.userid)
          },
          type: db.sequelize.QueryTypes.INSERT
        }
      ).then(function() {
        //they are not friends yet
        res.status(200).send(false);
      });
    }
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

router.post('/:userid/unfollow', function(req, res, next) {
  db.sequelize.query(
    `DELETE FROM "FollowerFollowed" WHERE FOLLOWER = :local_id AND FOLLOWED = :other_id`, {
      replacements: {
        local_id: res.locals.user.id,
        other_id: parseInt(req.params.userid)
      },
      type: db.sequelize.QueryTypes.DELETE
    }
  ).then(function() {
    res.status(200).end();
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

router.post('/:userid/unfriend', function(req, res, next) {
  db.sequelize.query(
    `DELETE FROM "FollowerFollowed" WHERE (FOLLOWER = :local_id AND FOLLOWED = :other_id) OR (FOLLOWER = :other_id AND FOLLOWED = :local_id)`, {
      replacements: {
        local_id: res.locals.user.id,
        other_id: parseInt(req.params.userid)
      },
      type: db.sequelize.QueryTypes.DELETE
    }
  ).then(function() {
    //they are no longer friends & leave socket
    io.socket().leave(parseInt(req.params.userid));
    res.status(200).end();
  }).catch(function(err) {
    res.status(500).send(err);
  });
});

module.exports = router;