var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var mysession = require('./config');
var session = require('client-sessions');

var index = require('./routes/index');
var user = require('./routes/user');
var post = require('./routes/post');

var db = require('./models/index.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session(mysession));

app.use(function(req, res, next) {
  if (req.session && req.session.user) {
    db.sequelize.query(
      'SELECT * FROM "Users" WHERE username = :username', {
        replacements: {
          username: req.session.user.username,
        },
        type: db.sequelize.QueryTypes.SELECT
      }
    ).then(function(user) {
      if (user.length !== 0) { // user never longer than 1 beacuse of username uniqueness
        req.user = user[0];
        delete req.user.password; // delete the password from the session
        req.session.user = user[0]; //refresh the session value
        res.locals.user = user[0];
      }
      next();
    });
  } else {
    next();
  }
});

app.use('/', index);
app.use('/user', user);
app.use('/post', post);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;