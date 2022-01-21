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

const inputs = [1, 2, 3, 4, 5, 6];

async.eachSeries(
  inputs,
  function updateObject(obj, done) {
    console.log(obj);
    done();
  },
  function allDone(err) {
    // this will be called when all the updates are done or an error occurred during the iteration
  }
);

// <------------------------------------------------>
// (async () => {
// await Type.updateOne(
//   { name: 'normal' },
//   { doubleDamageFrom: [types[1].id, types[2].id] }
// );
// await callback(null, 'success');
// await Type.findOne({ name: 'normal' })
//   .populate('doubleDamageFrom')
//   .exec(callback);
// })();
// <------------------------------------------------>
