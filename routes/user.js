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
    // OLD QUERY `INSERT INTO "Users" (username, password, dashaddress, privatekey, friends, following) VALUES (:username, :password, :dashaddress, :privatekey, '{${req.body.joinUsername}}', '{}')`
    `INSERT INTO "Users" (username, password, balance, friends, following) VALUES (:username, :password, :balance, '{${req.body.joinUsername}}', '{}')`, {
      replacements: {
        username: req.body.joinUsername,
        password: models.User.hashPassword(req.body.joinPassword),
        balance: req.body.joinBalance,
        //dashaddress: req.body.joinDashAddress,
        //privatekey: req.body.privateKey
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
  //display user's profile
  var current_relationship = '';
  if (typeof req.user !== 'undefined') {
    db.sequelize.query(
      'SELECT * FROM "Users" WHERE username = :username', {
        replacements: {
          username: req.params.username,
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    ).then(function(user) {
      if (user[0]) {
        if (res.locals.user.username == user[0].username) {
          current_relationship = 'self';
        } else if (user[0].friends.includes(res.locals.user.username)) {
          current_relationship = 'friend';
        } else if (res.locals.user.following.includes(user[0].username)) {
          current_relationship = 'following';
        }
        db.sequelize.query(
          'SELECT * FROM "Posts" WHERE SENDER = :username OR RECIPIENT = :username', {
            replacements: {
              username: [user[0].username],
            },
            type: db.sequelize.QueryTypes.SELECT
          }
        ).then(function(posts) {
          res.render('profile', {
            givenUser: user[0],
            postList: posts,
            relationship: current_relationship
          });
        });
      }
    });
  } else {
    //404
    res.render('index');
  }
});

router.post('/:username/follow', function(req, res, next) {
  db.sequelize.query(
    'SELECT * FROM "Users" WHERE USERNAME = :other_username', {
      replacements: {
        other_username: req.params.username,
      },
      type: db.sequelize.QueryTypes.SELECT
    }
  ).then(function(user) {
    //if user is already following, make them friends, if not, just follow
    if (user[0].following.includes(res.locals.user.username)) {
      //remove follow relationship from other user
      db.sequelize.query(
        `UPDATE "Users" SET following = array_remove(following, '${res.locals.user.username}') WHERE USERNAME = :other_username`, {
          replacements: {
            other_username: req.params.username,
          },
          type: db.sequelize.QueryTypes.UPDATE
        }
      ).then(function(posts) {
        //add friend relationship to other user
        db.sequelize.query(
          `UPDATE "Users" SET friends = array_cat(friends, '{${res.locals.user.username}}') WHERE USERNAME = :other_username`, {
            replacements: {
              other_username: req.params.username,
            },
            type: db.sequelize.QueryTypes.UPDATE
          }
        ).then(function(posts) {
          //add friend relationship to local user
          db.sequelize.query(
            `UPDATE "Users" SET friends = array_cat(friends, '{${req.params.username}}') WHERE USERNAME = :local_username`, {
              replacements: {
                local_username: res.locals.user.username,
              },
              type: db.sequelize.QueryTypes.UPDATE
            }
          ).then(function(posts) {
            //they are friends now
            res.send(true);
          }).catch(function(err) {
            console.error(err);
          });
        }).catch(function(err) {
          console.error(err);
        });
      }).catch(function(err) {
        console.error(err);
      });
    } else {
      //following
      db.sequelize.query(
        `UPDATE "Users" SET following = array_cat(following, '{${req.params.username}}') WHERE USERNAME = :local_username`, {
          replacements: {
            local_username: res.locals.user.username,
          },
          type: db.sequelize.QueryTypes.UPDATE
        }
      ).then(function(posts) {
        //they are not friends yet
        res.send(false);
      }).catch(function(err) {
        console.error(err);
      });
    }
  }).catch(function(err) {
    console.error(err);
  });
});

router.post('/:username/unfollow', function(req, res, next) {
  db.sequelize.query(
    `UPDATE "Users" SET following = array_remove(following, '${req.params.username}') WHERE USERNAME = :local_username`, {
      replacements: {
        local_username: res.locals.user.username,
      },
      type: db.sequelize.QueryTypes.UPDATE
    }
  ).then(function(posts) {
    res.end();
  }).catch(function(err) {
    console.error(err);
  });
});

router.post('/:username/unfriend', function(req, res, next) {
  db.sequelize.query(
    `UPDATE "Users" SET friends = array_remove(friends, '${req.params.username}') WHERE USERNAME = :local_username`, {
      replacements: {
        local_username: res.locals.user.username,
      },
      type: db.sequelize.QueryTypes.UPDATE
    }
  ).then(function(posts) {
    db.sequelize.query(
      `UPDATE "Users" SET friends = array_remove(friends, '${res.locals.user.username}') WHERE USERNAME = :other_username`, {
        replacements: {
          other_username: req.params.username,
        },
        type: db.sequelize.QueryTypes.UPDATE
      }
    ).then(function(posts) {
      res.end();
    }).catch(function(err) {
      console.error(err);
    });
  }).catch(function(err) {
    console.error(err);
  });
});

module.exports = router;