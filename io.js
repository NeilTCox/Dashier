var session = require('client-sessions');
var cookieParser = require('cookie');
var mysession = require('./config');
//var usersModel = require('./models/users');
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
        //join the socket rooms that this user is following??
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