const path = require('path');
const async = require('async');
const mongoose = require('mongoose');
require('dotenv').config();
// [ MODELS ]
const Type = require(path.join(__dirname, '../models/type'));
const Move = require(path.join(__dirname, '../models/move'));
// [ COMMAND LINE ]
const logger = require(path.join(__dirname, '../logger'));
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const argv = yargs(hideBin(process.argv)).argv;

// [ MONGO CONNECTION ]
mongoose.connect(process.env.MONGO_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

async.waterfall(
  [
    function (callback) {
      Type.find({}).select('name').exec(callback);
    },
    function (types, callback) {
      Move.find({})
        .select('name')
        .exec((err, moves) => {
          if (err) {
            callback(err);
          } else {
            callback(null, types, moves);
          }
        });
    },
    function (types, moves, callback) {
      const typeIds = {};
      const moveIds = {};
      types.forEach((type) => {
        typeIds[type.name] = type.id;
      });
      moves.forEach((move) => {
        moveIds[move.name] = move.id;
      });
      callback(null, typeIds, moveIds);
    },
    function (typeIds, moveIds, callback) {
      console.log(moveIds);
      console.log('\n');
      console.log(typeIds);
      callback(null, 'success');
    },
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

// TODO query types and moves
//  - write the data to a json file
// TODO makes objects {type: id}  {move: id}