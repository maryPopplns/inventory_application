const chalk = require('chalk');
const path = require('path');
const async = require('async');
const winston = require('winston');
const mongoose = require('mongoose');
const axios = require('axios').default;
const req = require('express/lib/request');
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
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    new winston.transports.File({ filename: 'logs/info.log', level: 'info' }),
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
      Type.find({}).exec(callback);
    },
    function (types, callback) {
      axios
        .all(endpoints.map((endpoint) => axios.get(endpoint)))
        .then((data) => {
          const typesDetails = data.map((type) => {
            const base = type.data.damage_relations;
            return (typeData = {
              name: type.data.name,
              doubleDamageFrom: base.double_damage_from,
              doubleDamageTo: base.double_damage_to,
              halfDamageFrom: base.half_damage_from,
              halfDamageTo: base.half_damage_to,
              noDamageFrom: base.no_damage_from,
              noDamageTo: base.no_damage_to,
            });
          });
          callback(null, { types, typesDetails });
        })
        .catch(function (error) {
          callback(error);
        });
    },
    // function (data, callback) {
    //   // TODO loop through details and create objects that will be inserted into the next function
    //   // TODO create object with name:id key:value pairs
    // },
    function (data, callback) {
      // TODO loop through the data in DB to find each
      // TODO update
      const { types, typesDetails } = data;
      //  update the documents
      async.eachSeries(
        types,
        async function updateObject(obj, done) {
          await Type.updateOne({ name: obj.name }, { new: 'test3' });
          await done;
        },
        function allDone(err) {
          if (err) {
            callback('updating: ' + err);
          } else {
            callback(null, 'success');
          }
          // this will be called when all the updates are done or an error occurred during the iteration
        }
      );
    },
  ],
  function (err, result) {
    if (err) {
      logger.error(err);
    }
    console.log(chalk.green(result));
    mongoose.connection.close();
  }
);
