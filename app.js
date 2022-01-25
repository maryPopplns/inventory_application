// [ DEPENDENCIES ]
const path = require('path');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
// [ FILE IMPORTS ]
const logger = require(path.join(__dirname, 'logger'));
const homeRouter = require(path.join(__dirname, '/routes/home'));
const usersRouter = require(path.join(__dirname, '/routes/users'));

const app = express();

// [ VIEW ENGINE SETUP ]
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// [ MONGO CONNECTION ]
mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on('error', (err) => logger.error(err));

// [ MIDDLWARE ]
app.use(morgan('dev'));
// TODO log all requests
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', homeRouter);
app.use('/users', usersRouter);

// [ 404 ROUTE ]
app.use(function (req, res, next) {
  next(createError(404));
});

// [ ERROR HANDLER ]
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
