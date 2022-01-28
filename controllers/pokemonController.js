const path = require('path');
const { logger } = require(path.join(__dirname, '../logger'));
const Type = require(path.join(__dirname, '../models/type'));
const Move = require(path.join(__dirname, '../models/move'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));

exports.pokemon_get = function (req, res, next) {
  // TODO query pokmon data
  Pokemon.find({})
    .limit(2)
    .populate('moves')
    .then((pokemon) => {
      const filteredPokemonData = pokemon.map((pokemon) => {
        const { name, pokeid, height, weight, moves, images, stats } = pokemon;
        const nameCap = Array.from(name)
          .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
          .join('');
        const move = moves.sort((a, b) => b.power - a.power);
        logger.debug(move);
        const image = images.large;
        return {
          name: nameCap,
          pokeid,
          height,
          weight,
          moves: { first: move[0], second: move[1] },
          image,
          stats,
        };
      });
      // [ RENDER CARDS ]
      res.render('pokemon', { data: filteredPokemonData });
    })
    .catch((err) => logger.error(err));
};