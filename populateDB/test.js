const chalk = require('chalk');
const path = require('path');
const async = require('async');
const winston = require('winston');
const mongoose = require('mongoose');
const axios = require('axios').default;
const req = require('express/lib/request');
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

const endpoints = [];
// for (let i = 1; i < 166; i++) {
for (let i = 1; i < 3; i++) {
  endpoints.push(axios.get(`https://pokeapi.co/api/v2/move/${i}`));
}
