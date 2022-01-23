const path = require('path');
const chalk = require('chalk');
const async = require('async');
const winston = require('winston');
const mongoose = require('mongoose');
const axios = require('axios').default;
const Type = require(path.join(__dirname, '../models/type'));
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
  endpoints.push(axios.get(`https://pokeapi.co/api/v2/type/${i}`));
}

async.waterfall(
  [
    function (callback) {
      // find ALL types
      Type.find({}).exec(callback);
    },
    function (types, callback) {
      // create object for EZ id access
      const ids = {};
      types.forEach((type) => {
        const name = type.name;
        const id = type.id;
        ids[name] = id;
      });
      callback(null, ids);
    },
    function (ids, callback) {
      // api calls, filtering only needed fields
      Promise.all(endpoints)
        .then(function (types) {
          const filteredResults = types.map((type) => {
            const base = type.data.damage_relations;
            return {
              name: type.data.name,
              details: {
                double_damage_from: base.double_damage_from,
                double_damage_to: base.double_damage_to,
                half_damage_from: base.half_damage_from,
                half_damage_to: base.half_damage_to,
                no_damage_from: base.no_damage_from,
                no_damage_to: base.no_damage_to,
              },
            };
          });
          callback(null, { ids, filteredResults });
        })
        .catch(function (err) {
          callback(err);
        });
    },
    function (data, callback) {
      // populate details with objectIDs
      const { ids, filteredResults } = data;
      const results = filteredResults.map((result) => {
        const { name, details } = result;
        const populated = {};
        for (const detail in details) {
          populated[detail] = details[detail].map((item) => {
            return ids[item.name];
          });
        }
        return { name, details: populated };
      });
      callback(null, results);
    },
    function (results, callback) {
      //  update the documents with populated fields
      async.eachSeries(
        results,
        async function (obj, done) {
          const { name, details } = await obj;
          await Type.updateOne(
            { name: name },
            {
              doubleDamageFrom: details.double_damage_from,
              doubleDamageTo: details.double_damage_to,
              halfDamageFrom: details.half_damage_from,
              halfDamageTo: details.half_damage_to,
              noDamageFrom: details.no_damage_from,
              noDamageTo: details.no_damage_to,
            }
          );
          await done;
        },
        function allDone(err) {
          if (err) {
            callback('updating' + err);
          } else {
            callback(null, 'success');
          }
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
