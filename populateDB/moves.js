const chalk = require('chalk');
const path = require('path');
const async = require('async');
const winston = require('winston');
const mongoose = require('mongoose');
const axios = require('axios').default;
const req = require('express/lib/request');
const { endianness } = require('os');
const Type = require(path.join(__dirname, '../models/type'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));
const Move = require(path.join(__dirname, '../models/move'));
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
    new winston.transports.File({
      filename: 'logs/info.log',
      level: 'info',
    }),
    // new winston.transports.File({ filename: 'logs/all.log' }),
  ],
});

const endpoints = [];
for (let i = 1; i < 3; i++) {
  endpoints.push(axios.get(`https://pokeapi.co/api/v2/move/${i}`));
}

// (() => {
//   Promise.all(endpoints)
//     .then((moves) => {
//       return moves.map((move) => {
//         const data = move.data;
//         return {
//           name: data.name,
//           effect: data.effect_entries[0].short_effect,
//           power: data.power,
//           pp: data.pp,
//           // type : tbd
//         };
//       });
//     })
//     .then((data) => console.log(data))
//     .catch((err) => {
//       logger.error(err);
//       mongoose.connection.close();
//     });
// })();

async.waterfall(
  [
    function (callback) {
      const types = Type.find({}).select('name');
      types.exec(function (err, types) {
        if (err) {
          callback(err);
        } else {
          const ids = {};
          types.forEach((type) => {
            const name = type.name;
            const id = type.id;
            ids[name] = id;
          });
          callback(null, ids);
        }
      });
    },
    function (ids, callback) {
      Promise.all(endpoints)
        .then((moves) => {
          return moves.map((move) => {
            const data = move.data;
            return {
              name: data.name,
              effect: data.effect_entries[0].short_effect,
              power: data.power,
              pp: data.pp,
              type: ids[data.type.name],
            };
          });
        })
        .then((data) => callback(null, data))
        .catch((err) => {
          logger.error(err);
          mongoose.connection.close();
        });
    },
  ],
  function (err, result) {
    if (err) {
      logger.error(err);
    } else {
      console.log(result);
      console.log(chalk.green('\n success \n'));
      mongoose.connection.close();
    }
  }
);
