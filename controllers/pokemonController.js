const path = require('path');
const async = require('async');
const Type = require(path.join(__dirname, '../models/type'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));
const { logger } = require(path.join(__dirname, '../logger'));
const { check, validationResult } = require('express-validator');

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
                name,
                nameCap,
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
exports.pokemon_instance_update_post = [
  function (req, res, next) {
    if (!(req.body.types instanceof Array)) {
      if (typeof req.body.types === 'undefined') {
        req.body.types = [];
      } else {
        req.body.types = new Array(req.body.types);
      }
    }
    next();
  },
  // [ FORM VALIDATION ]
  check('name')
    .trim()
    .isLength({ min: 1, max: 20 })
    .withMessage('Must be 1-20 characters long')
    .escape(),
  check('pokeid', 'Must be a number.').trim().isNumeric().escape(),
  check('height', 'Must be a number.').trim().isNumeric().escape(),
  check('weight', 'Must be a number.').trim().isNumeric().escape(),
  check('hp', 'Must be a number.').trim().isNumeric().escape(),
  check('attack', 'Must be a number.').trim().isNumeric().escape(),
  check('specialAttack', 'Must be a number.').trim().isNumeric().escape(),
  check('specialDefense', 'Must be a number.').trim().isNumeric().escape(),
  check('speed', 'Must be a number.').trim().isNumeric().escape(),
  check('types.*').escape(),

  // [ UPDATE FORM / SEND BACK ERRORS ]
  function (req, res, next) {
    const {
      name,
      pokeid,
      height,
      weight,
      hp,
      attack,
      specialAttack,
      specialDefense,
      types,
      speed,
    } = req.body;
    const stats = {
      hp,
      attack,
      'special-attack': specialAttack,
      'special-defense': specialDefense,
      speed,
    };
    Type.find()
      .then((result) => {
        const errors = validationResult(req);
        const errorsArray = errors.array();
        // [ ERRORS ]
        if (!errors.isEmpty()) {
          const allTypes = result.map(({ name }) => {
            const answer = types.includes(name);
            const nameCap = Array.from(name)
              .map((letter, index) =>
                index === 0 ? letter.toUpperCase() : letter
              )
              .join('');
            return {
              name,
              nameCap,
              id: `${name}TypeCheckbox`,
              checked: answer,
            };
          });
          res.render('updatePokemonGet', {
            name,
            pokeid,
            height,
            weight,
            stats,
            allTypes,
            errorsArray,
          });
        } else {
          // [ UPDATE POKEMON ]
          Pokemon.findById(req.params.id)
            .then(({ moves }) => {
              const ids = {};
              result.forEach(({ id, name }) => {
                ids[name] = id;
              });
              const typeIDs = types.map((type) => ids[type]);
              const pokemon = new Pokemon({
                name,
                pokeid,
                height,
                weight,
                stats,
                moves,
                types: typeIDs,
                _id: req.params.id,
              });
              Pokemon.findByIdAndUpdate(
                req.params.id,
                pokemon,
                {},
                function (error, thepokemon) {
                  if (error) {
                    next(error);
                  } else {
                    res.redirect(thepokemon.url);
                  }
                }
              );
            })
            .catch((error) => {
              logger.erro(error);
              next(error);
            });
        }
      })
      .catch((error) => {
        logger.error(error);
        next(error);
      });
  },
];

// [ DELETE INSTANCE GET ]
exports.pokemon_instance_delete_get = function (req, res, next) {
  Pokemon.findById(req.params.id)
    .then(({ name }) => {
      const nameCap = Array.from(name)
        .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
        .join('');
      res.render('deletePokemonGet', { name: nameCap, errors: false });
    })
    .catch((error) => {
      logger.error(error);
      next(error);
    });
};

// [ DELETE INSTANCE POST ]
exports.pokemon_instance_delete_post = [
  check('deletePokemon').trim().escape(),
  function (req, res, next) {
    // [ INCORRECT PASSWORD ]
    if (req.body.deletePokemon !== process.env.DELETE_PASSWORD) {
      Pokemon.findById(req.params.id)
        .then(({ name }) => {
          const nameCap = Array.from(name)
            .map((letter, index) =>
              index === 0 ? letter.toUpperCase() : letter
            )
            .join('');
          res.render('deletePokemonGet', { name: nameCap, errors: true });
        })
        .catch((error) => {
          logger.error(error);
          next(error);
        });
      // [ CORRECT PASSWORD ]
    } else {
      Pokemon.findByIdAndDelete(req.params.id)
        .then(() => {
          res.redirect('/pokemon');
        })
        .catch((error) => {
          logger.error(error);
          next(error);
        });
    }
  },
];
