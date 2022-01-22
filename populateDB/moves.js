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
mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// [ WINSTON LOGGER ]
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

async.waterfall(
  [
    function (callback) {
      // [ QUERY TYPES ]
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
      // [ API CALLS ]
      const endpoints = [];
      for (let i = argv.min; i < argv.max; i++) {
        console.log(chalk.cyan(i));
        // endpoints.push(axios.get(`https://pokeapi.co/api/v2/move/${i}`));
      }
      callback(null, 'success');
      // Promise.all(endpoints)
      //   .then((moves) => {
      //     const data = moves.map((move) => {
      //       const data = move.data;
      //       return {
      //         name: data.name,
      //         effect: data.effect_entries[0].short_effect,
      //         power: data.power,
      //         pp: data.pp,
      //         type: ids[data.type.name],
      //       };
      //     });
      //     callback(null, data);
      //   })
      //   .catch((err) => {
      //     logger.error(err);
      //     mongoose.connection.close();
      //   });
    },
    // function (data, callback) {
    //   // [ CREATE/INSERT DOCUMENTS ]
    //   const moves = data.map((move) => {
    //     return new Move({
    //       name: move.name,
    //       effect: move.effect,
    //       power: move.power,
    //       pp: move.pp,
    //       type: move.type,
    //     });
    //   });
    //   Move.insertMany(moves, function (err, docs) {
    //     if (err) {
    //       callback(err);
    //     } else {
    //       callback(null, 'success');
    //     }
    //   });
    // },
  ],
  function (err, result) {
    if (err) {
      logger.error(err);
      mongoose.connection.close();
    } else {
      console.log(result);
      mongoose.connection.close();
    }
  }
);
