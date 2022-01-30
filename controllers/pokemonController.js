const path = require('path');
const { logger } = require(path.join(__dirname, '../logger'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));

exports.pokemon_get = function (req, res, next) {
  // [ QUERY/FILTER POKEMON DATA ]
  Pokemon.find({})
    .populate('moves')
    .then((pokemon) => {
      const filteredPokemonData = pokemon.map((pokemon) => {
        const { id, name, pokeid, height, weight, moves, images, stats } =
          pokemon;
        const nameCap = Array.from(name)
          .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
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
      });
      // [ RENDER POKEMON ]
      res.render('pokemon', { data: filteredPokemonData });
    })
    .catch((err) => logger.error(err));
};

exports.pokemon_instance_get = function (req, res, next) {
  // [ QUERY/FILTER POKEMON INSTANCE DATA ]
  const id = req.params.id;
  Pokemon.findById(id)
    .populate('moves types')
    .then(({ name, pokeid, height, weight, moves, stats, types, images }) => {
      const nameCap = Array.from(name)
        .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
        .join('');
      const filteredMoves = moves.map(({ name, url }) => {
        return { name, url };
      });
      const filteredTypes = types.map(({ name, url }) => {
        return { name, url };
      });
      // [ RENDER POKEMON INSTANCE ]
      res.render('pokemonInstance', {
        name: nameCap,
        pokeid,
        height,
        weight,
        moves: filteredMoves,
        stats,
        types: filteredTypes,
        images,
      });
    })
    .catch((error) => logger.error(error));
};
