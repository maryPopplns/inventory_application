const path = require('path');
const { logger } = require(path.join(__dirname, '../logger'));
const Type = require(path.join(__dirname, '../models/type'));
const Move = require(path.join(__dirname, '../models/move'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));

exports.pokemon_get = function (req, res, next) {
  // TODO query pokmon data
  Pokemon.find({})
    // .limit(10)
    .populate('moves')
    .then((pokemon) => {
      const filteredPokemonData = pokemon.map((pokemon) => {
        const { id, name, pokeid, height, weight, moves, images, stats } =
          pokemon;
        const nameCap = Array.from(name)
          .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
          .join('');
        const image = images.large;

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
          // TODO randomize moves
          image,
          stats,
        };
      });
      // [ RENDER CARDS ]
      res.render('pokemon', { data: filteredPokemonData });
    })
    .catch((err) => logger.error('error' + err));
};
