// [ MODELS ]
const path = require('path');
const Type = require(path.join(__dirname, '../models/type'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));
const Move = require(path.join(__dirname, '../models/move'));
// [ COMMAND LINE ]
const chalk = require('chalk');
const winston = require('winston');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

const async = require('async');
const mongoose = require('mongoose');
const axios = require('axios').default;
const req = require('express/lib/request');
const { endianness } = require('os');
require('dotenv').config();

// [ MONGO CONNECTION ]
// mongoose.connect(process.env.MONGO_STRING, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// [ WINSTON LOGGER ]
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'user-service' },
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: 'populateDB/logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({
      filename: 'populateDB/logs/info.log',
      level: 'info',
    }),
    // new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

logger.info(chalk.red('hola mundo'));
