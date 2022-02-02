const path = require('path');
const { logger } = require(path.join(__dirname, '../logger'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));

exports.home_get = function (req, res, next) {
  // [ QUERY/FILTER POKEMON DATA ]
  Pokemon.find({})
    .select('name images.animation')
    .then((pokemon) => {
      const filteredPokemonData = pokemon
        .map((pokemon) => {
          const name = Array.from(pokemon.name)
            .map((letter, index) =>
              index === 0 ? letter.toUpperCase() : letter
            )
            .join('');
          return {
            name: name,
            animation: pokemon.images.animation,
            id: pokemon.id,
            pokeid: pokemon.pokeid,
          };
        })
        .sort((a, b) => a.pokeid - b.pokeid);
      // [ RENDER GIF ANIMATIONS ]
      res.render('home', { data: filteredPokemonData });
    })
    .catch((err) => {
      logger.error(err);
      next(err);
    });
};
