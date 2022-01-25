const path = require('path');
const async = require('async');
const mongoose = require('mongoose');
const axios = require('axios').default;
const ids = require(path.join(__dirname, '/ids'));
require('dotenv').config();
// [ MODELS ]
const Type = require(path.join(__dirname, '../models/type'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));
const Move = require(path.join(__dirname, '../models/move'));
// [ COMMAND LINE ]
const chalk = require('chalk');
const { db } = require(path.join(__dirname, '../logger'));
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
    // [ API CALLS ]
    function (callback) {
      const endpoints = [];
      for (let i = argv.min; i < argv.max; i++) {
        // console.log(chalk.cyan(i));
        endpoints.push(axios.get(`https://pokeapi.co/api/v2/pokemon/${i}`));
      }
      Promise.all(endpoints)
        .then((allPokemon) => {
          const { moveIds, typeIds } = ids;
          const filteredData = allPokemon.map((pokemon) => {
            const { name, id, height, weight, moves, stats, types, sprites } =
              pokemon.data;
            const finalStats = {};
            const filteredMoves = moves
              .map((move) => {
                return moveIds[move.move.name];
              })
              .filter((move) => move !== undefined);
            stats.forEach((stat) => {
              finalStats[stat.stat.name] = stat.base_stat;
            });
            const filteredTypes = types.map((type) => {
              return typeIds[type.type.name];
            });
            const filteredImages = {
              back: sprites.back_shiny,
              front: sprites.front_shiny,
              animation:
                sprites.versions['generation-v']['black-white'].animated[
                  'front_default'
                ],
              large: sprites.other['official-artwork']['front_default'],
            };

            return {
              name,
              pokeid: id,
              height,
              weight,
              filteredMoves,
              filteredStats: finalStats,
              filteredTypes,
              filteredImages,
            };
          });
          callback(null, filteredData);
        })
        .catch((err) => logger.err(err));
    },
    function (filteredData, callback) {
      // [ CREATE/INSERT DOCUMENTS ]
      const pokemonDocuments = filteredData.map((pokemonData) => {
        const {
          name,
          pokeid,
          height,
          weight,
          filteredMoves,
          filteredStats,
          filteredTypes,
          filteredImages,
        } = pokemonData;

        return new Pokemon({
          name: name,
          pokeid: pokeid,
          height: height,
          weight: weight,
          moves: filteredMoves,
          stats: filteredStats,
          types: filteredTypes,
          images: filteredImages,
        });
      });
      Pokemon.insertMany(pokemonDocuments, function (err) {
        if (err) {
          callback('inserting documents error: ' + err);
        } else {
          callback(null, 'success');
        }
      });
    },
  ],
  function (err, results) {
    if (err) {
      logger.error(err);
      mongoose.connection.close();
    } else {
      logger.info(results);
      mongoose.connection.close();
    }
  }
);
