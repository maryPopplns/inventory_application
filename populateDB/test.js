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
const { db } = require(path.join(__dirname, '../logger'));
const Type = require(path.join(__dirname, '../models/type'));
require('dotenv').config();

mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db1 = mongoose.connection;
db1.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Move.find({})
//   .populate('')
//   .exec((error, result) => {
//     if (error) {
//       db.error(error);
//       mongoose.connection.close();
//     } else {
//       const ids = result.map((move) => move.id);
//       const newOne = new Pokemon({ name: 'the one', moves: ids });
//       newOne.save((err, result) => {
//         if (err) {
//           db.error(err);
//           mongoose.connection.close();
//         } else {
//           db.debug(result);
//           mongoose.connection.close();
//         }
//       });
//     }
//   });

// Pokemon.find({ name: 'the one' })
//   .populate('moves')
//   .then((result) => {
//     result[0].moves.forEach((move) => db.debug(move));
//     mongoose.connection.close();
//   })
//   .catch((error) => db.error(error));
