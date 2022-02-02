const path = require('path');
const async = require('async');
const { logger } = require(path.join(__dirname, '../logger'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));
const Type = require(path.join(__dirname, '../models/type'));
const Move = require(path.join(__dirname, '../models/move'));

exports.pokemon_get = function (req, res, next) {
  // [ QUERY/FILTER POKEMON DATA ]
  Pokemon.find({})
    .populate('moves')
    .then((results) => {
      const filteredPokemonData = results.map(
        ({ id, name, pokeid, height, weight, moves, types, images, stats }) => {
          const nameCap = Array.from(name)
            .map((letter, index) =>
              index === 0 ? letter.toUpperCase() : letter
            )
            .join('');
          const image = images.large;
          logger.debug(moves);
          logger.debug(types);
          // [ PULL RANDOM MOVES ]
          const ranMoves = [];
          if (moves.length === 1) {
            ranMoves.push(0);
          } else if (moves.length === 2) {
            ranMoves.push(0);
            ranMoves.push(1);
          } else {
            while (ranMoves.length < 3) {
              const random = Math.floor(Math.random() * moves.length);
              if (ranMoves.indexOf(random) === -1) {
                ranMoves.push(random);
              }
            }
          }
          return {
            name: nameCap,
            id,
            pokeid,
            height,
            weight,
            moves: {
              first: moves[ranMoves[0]],
              second: moves[ranMoves[1]],
              third: moves[ranMoves[2]],
            },
            image,
            stats,
          };
        }
      );

      // [ RENDER POKEMON ]
      res.render('pokemon', { data: filteredPokemonData });
    })
    .catch((err) => {
      logger.error(err);
      next(err);
    });
};

exports.pokemon_instance_get = function (req, res, next) {
  // [ QUERY/FILTER POKEMON INSTANCE DATA ]
  const id = req.params.id;
  Pokemon.findById(id)
    .populate('moves types')
    .then(
      ({ id, name, pokeid, height, weight, moves, stats, types, images }) => {
        const nameCap = Array.from(name)
          .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
          .join('');
        const filteredMoves = moves.map(({ name, url }) => {
          return { name, url };
        });
        const filteredTypes = types.map(({ name, url }) => {
          return { name, url };
        });
        const updateInstance = `${id}/update`;
        const deleteInstance = `${id}/delete`;
        // [ RENDER POKEMON INSTANCE ]
        res.render('pokemonInstance', {
          id,
          name: nameCap,
          pokeid,
          height,
          weight,
          moves: filteredMoves,
          stats,
          pokeTypes: filteredTypes,
          images,
          updateInstance,
          deleteInstance,
        });
      }
    )
    .catch((error) => {
      logger.error(error);
      next(error);
    });
};

// [ POKE INSTANCE UPDATE GET ]
exports.pokemon_instance_update_get = function (req, res, next) {
  async.waterfall(
    [
      // [ QUERY/FILTER INSTANCE TYPES ]
      function (callback) {
        Pokemon.findById(req.params.id)
          .select('types')
          .populate('types')
          .then(({ types }) => {
            const filteredInstanceTypes = types.map(({ name }) => name);
            callback(null, filteredInstanceTypes);
          })
          .catch((error) => callback(error));
      },
      // [ QUERY/FILTER ALL TYPES ]
      function (instanceTypes, callback) {
        Type.find()
          .then((result) => {
            const allTypes = result.map(({ name }) => {
              const answer = instanceTypes.includes(name);
              const nameCap = Array.from(name)
                .map((letter, index) =>
                  index === 0 ? letter.toUpperCase() : letter
                )
                .join('');
              return {
                name: nameCap,
                id: `${name}TypeCheckbox`,
                checked: answer,
              };
            });
            callback(null, allTypes);
          })
          .catch((error) => callback(error));
      },
      // [ QUERY/FILTER POKEMON INSTANCE ]
      function (allTypes, callback) {
        const id = req.params.id;
        Pokemon.findById(id)
          .populate('moves types')
          .then(({ name, pokeid, height, weight, stats, images }) => {
            const nameCap = Array.from(name)
              .map((letter, index) =>
                index === 0 ? letter.toUpperCase() : letter
              )
              .join('');
            callback(null, allTypes, {
              name: nameCap,
              pokeid,
              height,
              weight,
              stats,
              images,
            });
          })
          .catch((error) => callback(error));
      },
    ],
    // [ ERROR HANDLING / RENDER UPDATE ROUTE ]
    function (error, allTypes, pokemonInstance) {
      if (error) {
        logger.error(error);
        next(error);
        res.end('success');
      } else {
        const { name, pokeid, height, weight, stats, images } = pokemonInstance;
        res.render('updatePokemonGet', {
          name,
          pokeid,
          height,
          weight,
          stats,
          images,
          allTypes,
        });
      }
    }
  );
};

// [ UPDATE POKEMON POST ]
exports.pokemon_instance_update_post = function (req, res, next) {
  const id = req.params.id;
  res.render('updatePokemonPost', { name: 'name' });
};

exports.pokemon_instance_delete_get = function (req, res, next) {
  const id = req.params.id;
  res.end(id);
};
