'use strict';

const compression = require('compression');
const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const knexDB = require('./config/knex-express');
const cookieConf = require('./config/cookie-conf');

const authMiddleware = require('./routes/auth-middleware');
const index = require('./routes/index');
const users = require('./routes/users');
const materials = require('./routes/materials');
const products = require('./routes/products');
const orders = require('./routes/orders');

const app = express();

// compress all responses
app.use(compression());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(cookieParser(cookieConf.secretKey)); // signed cookie !!!
app.use(express.static(path.join(__dirname, 'public')));
app.use(knexDB()); // see ./config/knex***.js for details

app.use('*', authMiddleware);
app.use('/', index);
app.use('/v1/user', users);
app.use('/v1/material', materials);
app.use('/v1/product', products);
app.use('/v1/order', orders);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
