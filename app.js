const cookieParser = require('cookie-parser');
const createError = require('http-errors');
const mongoose = require('mongoose');
const winston = require('winston');
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const Pokemon = require(path.join(__dirname, '/models/pokemon'));
require('dotenv').config();

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// mongo connection
const MONGO_STRING = `mongodb+srv://spencer:${process.env.DB_PASSWORD}@${process.env.DB}.zvgww.mongodb.net/pokeInventory?retryWrites=true&w=majority`;
mongoose.connect(MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;

var pokemon = new Pokemon({
  name: 'spencer',
  types: [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine',
    'ten',
    '11',
  ],
});

pokemon.save(function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('success');
  }

  //successful - redirect to new book record.
});

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
