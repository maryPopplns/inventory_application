const async = require('async');
const mongoose = require('mongoose');
const axios = require('axios').default;
require('dotenv').config();
// [ MODELS ]
const path = require('path');
const Type = require(path.join(__dirname, '../models/type'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));
const Move = require(path.join(__dirname, '../models/move'));
// [ COMMAND LINE ]
const chalk = require('chalk');
const logger = require(path.join(__dirname, '../logger'));
// const winston = require('winston');
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

// TODO import {type: id} and {move: id} to reduce calls
// TODO make calls to pokemon api create ez to use object with data
// -->  replace types and moves with Object ID's
// TODO create documents from the data then save them
