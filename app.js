var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var sessions = require('express-session');

const { engine } = require('express-handlebars');

const dotenv = require('dotenv');
dotenv.config();

const db = require('./config/database');

var {
  apiRouter,
  webRouter
} = require('./routes/index');


var app = express();

app.engine('hbs', engine({
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layouts',
  extname: '.hbs'
}));

app.set('view engine', 'hbs');
// app.set('views', path.join(__dirname, 'views'));

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  cookie: {
    maxAge: oneDay,
    secure: false
  },
  resave: false
}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', apiRouter);
app.use('/web', webRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
