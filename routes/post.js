var express = require('express');
var router = express.Router();
var io = require('../io');
var db = require('../models/index.js');

router.post('/', function(req, res) {
  // var newPost = new postsModel({
  //   author_username: req.user.username,
  //   main_content: req.body.post_content
  // });
  // newPost.save(function(err, post) {
  //   if (err) {
  //     return console.error(err);
  //   }
  //   io.instance().to(req.user.username).emit('newPost', {
  //     data: newPost
  //   });
  //   res.send(newPost);
  // });

  db.sequelize.query(
    'INSERT INTO "Posts" (sender, amount, recipient, message) VALUES (:sender, :amount, :recipient, :message)', {
      replacements: {
        sender: res.locals.user.username,
        amount: req.body.amount,
        recipient: req.body.recipient,
        message: req.body.message
      },
      type: db.sequelize.QueryTypes.INSERT
    }
  ).then(function(post) {
    res.send(post);
  }).catch(function(err) {
    //handle failed insertion
    res.redirect("https://yahoo.com");
    return console.error(err);
  });
});

module.exports = router;