var session = require('client-sessions');
var cookieParser = require('cookie');
var mysession = require('./config');
var db = require('./models/index.js');

var io = null;
var this_socket = null;

module.exports = {
  init: function(server) {
    io = require('socket.io')(server);

    io.on('connection', function(socket) {
      this_socket = socket;
      var cookie = socket.request.headers.cookie;
      cookie = cookieParser.parse(cookie);
      cookie = session.util.decode(mysession, cookie.session);

      if (cookie) {
        //join the socket rooms that this user is friends with
        db.sequelize.query(
          'SELECT ALL followed FROM "FollowerFollowed" WHERE ((FOLLOWER = :local_id OR FOLLOWED = :local_id) AND FRIENDS = true)', {
            replacements: {
              local_id: cookie.content.user.id,
            },
            type: db.sequelize.QueryTypes.SELECT
          }
        ).then(function(friend_ids) {
          //join your own socket
          socket.join(cookie.content.user.id);
          if (friend_ids.length > 0) { // user never longer than 1 beacuse of username uniqueness
            for (var i = 0; i < friend_ids.length; i++) {
              socket.join(friend_ids[i].followed);
            }
          }
        });
      } else {
        //user does not exist
        console.log('H E k, user does not exist');
        res.status(500).send('user cookie could not be found');
      }
    });
  },
  instance: function() {
    return io;
  },
  socket: function() {
    return this_socket;
  }
};