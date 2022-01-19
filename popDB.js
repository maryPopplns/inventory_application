const mongoose = require('mongoose');
const path = require('path');
const winston = require('winston');
const Pokemon = require(path.join(__dirname, '/models/pokemon'));
const Type = require(path.join(__dirname, '/models/type'));
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
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

const PokeInstance = new Pokemon({
  name: 'placeholder',
  types: [1, 2],
  moves: [1, 2],
  image: 'urlplaceholder',
});

PokeInstance.save(function (err) {
  if (err) {
    logger.error(err);
  }
  //successful - redirect to new book record.
  res.redirect(book.url);
});
