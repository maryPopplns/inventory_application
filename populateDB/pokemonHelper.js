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

const moveIds = {};
const typeIds = {};

// use async parallel to make the calls to mongo
// moves / types

// TODO query types and moves
//  - write the data to a json file
// TODO makes objects {type: id}  {move: id}
