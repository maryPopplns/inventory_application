const https = require('https');
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

// for (let i = 1; i < 19; i++) {
for (let i = 1; i < 3; i++) {
  const options = {
    hostname: 'pokeapi.co',
    port: 443,
    path: `/api/v2/type/${i}`,
    method: 'GET',
  };

  const req = https.request(options, (res) => {
    res.on('data', (data) => {
      console.log(data);
    });
  });

  req.on('error', (error) => {
    winston.error(error);
  });

  // create model with api data
  const TypeInstance = new Type({
    name: '',
  });
  // save
  TypeInstance.save(function (err) {
    if (err) {
      logger.error(err);
    }
  });
}
