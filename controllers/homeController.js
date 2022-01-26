const path = require('path');
const { logger } = require(path.join(__dirname, '../logger'));
const Type = require(path.join(__dirname, '../models/type'));
const Move = require(path.join(__dirname, '../models/move'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));

exports.home_get = function (req, res, next) {
  // [ QUERY/FILTER POKEMON DATA ]
  Pokemon.find({})
    .limit(3)
    .select('name images.animation')
    .then((pokemon) => {
      const filteredPokemonData = pokemon.map((pokemon) => {
        const name = Array.from(pokemon.name)
          .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
          .join('');
        return {
          name: name,
          animation: pokemon.images.animation,
          id: pokemon.id,
        };
      });
      logger.debug(filteredPokemonData);
      // [ RENDER GIF ANIMATIONS ]
      res.render('home', { data: filteredPokemonData });
    })
    .catch((err) => logger.error(err));
};
