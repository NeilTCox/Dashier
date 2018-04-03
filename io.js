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
          'SELECT * FROM "Users" WHERE username = :username', {
            replacements: {
              username: cookie.content.user.username,
            },
            type: db.sequelize.QueryTypes.SELECT
          }
        ).then(function(user) {
          if (user[0]) { // user never longer than 1 beacuse of username uniqueness
            for (var i = 0; i < user[0].friends.length; i++) {
              socket.join(user[0].friends[i]);
            }
          } else {
            //user does not exist
            console.log('H E k, user does not exist');
            res.status(500).send('user cookie could not be found');
          }
        });
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