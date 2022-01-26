const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const async = require('async');
const winston = require('winston');
const mongoose = require('mongoose');
const axios = require('axios').default;
const req = require('express/lib/request');
const Pokemon = require('../models/pokemon');
const Move = require('../models/move');
const Type = require(path.join(__dirname, '../models/type'));
const { db } = require(path.join(__dirname, '../logger'));
require('dotenv').config();

mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db1 = mongoose.connection;
db1.on('error', console.error.bind(console, 'MongoDB connection error:'));

Pokemon.findOne({}).exec((err, result) => {
  if (err) {
    db.error(err);
    mongoose.connection.close();
  } else {
    db.info(result);
    mongoose.connection.close();
  }
});
