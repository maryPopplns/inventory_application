const path = require('path');
const { logger } = require(path.join(__dirname, '../logger'));
const Type = require(path.join(__dirname, '../models/type'));
const Move = require(path.join(__dirname, '../models/move'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));

exports.moves_get = function (req, res, next) {
  // [ QUERY/FILTER MOVES DATA ]
  // TODO query data
  Move.find({})
    .populate('type')
    .then((moves) => {
      const filteredMoves = moves.map(
        ({ name, effect, power, type, pp, url }) => {
          return {
            name,
            effect,
            power,
            type: type.name,
            pp,
            url,
          };
        }
      );
      res.render('moves', { moves: filteredMoves });
    });
};
