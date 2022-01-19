const path = require('path');
const async = require('async');
const winston = require('winston');
const mongoose = require('mongoose');
const axios = require('axios').default;
const Type = require(path.join(__dirname, '/models/type'));
const Pokemon = require(path.join(__dirname, '/models/pokemon'));
require('dotenv').config();

// connect to mongo
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
    // new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

// create endpoints
const endpoints = [];
for (let i = 1; i < 19; i++) {
  endpoints.push(`https://pokeapi.co/api/v2/type/${i}`);
}

async.waterfall(
  [
    function (callback) {
      let one = [];
      axios
        .all(endpoints.map((endpoint) => axios.get(endpoint)))
        .then((data) => {
          data.forEach((endpoint) => {
            one.push(endpoint.data.name);
          });
          callback(null, one);
        })
        .catch(function (error) {
          callback(error, one);
        });
    },
  ],
  function (err, result) {
    if (err) {
      logger.error(err);
    }
    console.log(result);
    mongoose.connection.close();
  }
);

// const type = new Type({
//   name: name,
// });
// // save or log errors
// type.save(function (err) {
//   if (err) {
//     logger.error(err);
//     return;
//   }
// });
