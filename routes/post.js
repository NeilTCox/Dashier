var express = require('express');
var router = express.Router();
var io = require('../io');
var db = require('../models/index.js');

var node_blockcypher = require('blockcypher');
var blockcypher = new node_blockcypher('btc', 'test3', 'e03704d8f1854623a8014ccaf861bd1d');
var bitcoin = require("bitcoinjs-lib-dash");
var bigi = require("bigi");
var buffer = require('buffer');

router.post('/', function(req, res) {
  //constructs newtx object
  function constructNewTX(recipient_address) {
    var newtx = {
      inputs: [{
        addresses: [res.locals.user.dashaddress]
      }],
      outputs: [{
        addresses: [recipient_address],
        value: req.body.amount * 100000000
      }]
    };
    return newtx;
  }


  // console.log("before keys");
  // console.log(res.locals.user.privatekey);
  // var test = bigi.fromHex(res.locals.user.privatekey);
  // console.log(test);
  // console.log('after bigi!');
  // var keys = new bitcoin.ECPair(bigi.fromBuffer(res.locals.user.privatekey));
  // console.log(keys);
  // console.log("past keys");

  // TRY LOGGING AND CHECKING INPUT SECTION OF TMPTX?
  // //construct temporary tx skeleton
  // var newtx = constructNewTX(user[0].dashaddress);
  //
  // console.log(blockcypher);
  // blockcypher.newTX(newtx, function(err, tmptx) {
  //   console.log(tmptx);
  //
  //   // signing each of the hex-encoded string required to finalize the transaction
  //   tmptx.pubkeys = [];
  //   tmptx.signatures = tmptx.tosign.map(function(tosign, n) {
  //     tmptx.pubkeys.push(keys.getPublicKeyBuffer().toString("hex"));
  //     return keys.sign(new buffer.Buffer(tosign, "hex")).toDER().toString("hex");
  //   });
  //
  //   console.log('tmptx BEFORE sending:');
  //   console.log(tmptx);
  //
  //   blockcypher.sendTX(tmptx, function(err, cmptx) {
  //     if (err) {
  //       console.error(err);
  //     }
  //     console.log('tmptx AFTER sending:');
  //     console.log(cmptx);
  //   });
  // });
  //
  // console.log('past sending!');



  if (res.locals.user.balance > 0 && req.body.amount > 0) {
    db.sequelize.query(
      'SELECT * FROM "Users" WHERE username = :recipient', {
        replacements: {
          recipient: req.body.recipient,
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    ).then(function(user) {
      if (user[0]) { // user never longer than 1 beacuse of username uniqueness
        //subtract balance from sender
        db.sequelize.query(
          'UPDATE "Users" SET balance = balance - :amount WHERE username = :sender', {
            replacements: {
              sender: res.locals.user.username,
              amount: req.body.amount
            },
            type: db.sequelize.QueryTypes.UPDATE
          }
        ).then(function(post) {
          // add balance to recipient
          db.sequelize.query(
            'UPDATE "Users" SET balance = balance + :amount WHERE username = :recipient', {
              replacements: {
                recipient: req.body.recipient,
                amount: req.body.amount
              },
              type: db.sequelize.QueryTypes.UPDATE
            }
          ).then(function(post) {
            // insert new post to database
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
              //send constructed post to client along with updated balance to display
              res.locals.user.balance = res.locals.user.balance - req.body.amount;
              var newPost = {
                sender: res.locals.user.username,
                amount: req.body.amount,
                recipient: req.body.recipient,
                message: req.body.message,
                balance: res.locals.user.balance
              };
              io.instance().to(req.user.username).emit('newPost', {
                data: newPost
              });
              res.send(newPost);
            }).catch(function(err) {
              return console.error(err);
            });
          }).catch(function(err) {
            return console.error(err);
          });
        }).catch(function(err) {
          return console.error(err);
        });
      } else {
        //user does not exist
        console.log('H E k, recipient does not exist');
        res.status(500).send('recipient does not exist');
      }
    });
  } else {
    res.status(500).send('invalid transaction');
  }

});

module.exports = router;