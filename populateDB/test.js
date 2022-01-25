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
require('dotenv').config();

mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
    // new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

Pokemon.find({ name: 'charizard' })
  .populate('moves')
  .exec((err, results) => {
    if (err) {
      logger.error('error' + err);
      mongoose.connection.close();
    }
    const moves = results[0].moves;
    const filtered = moves
      .map(({ power, name }) => {
        return {
          name,
          power,
        };
      })
      .filter((move) => move.power !== null);
    const sorted = filtered.sort((a, b) => a.power - b.power).reverse();
    console.log(sorted);
    mongoose.connection.close();
  });
