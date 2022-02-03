const path = require('path');
const { logger } = require(path.join(__dirname, '../logger'));
const Type = require(path.join(__dirname, '../models/type'));
const Move = require(path.join(__dirname, '../models/move'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));

exports.moves_get = function (req, res, next) {
  // [ QUERY/FILTER MOVES DATA ]
  Move.find({})
    .populate('type')
    .then((moves) => {
      const filteredMoves = moves.map(
        ({ name, effect, power, type, pp, url }) => {
          const nameCap = Array.from(name)
            .map((letter, index) =>
              index === 0 ? letter.toUpperCase() : letter
            )
            .join('');
          return {
            name: nameCap,
            effect,
            power,
            type: type.name,
            pp,
            url,
          };
        }
      );
      // [ RENDER MOVES ]
      res.render('moves', { moves: filteredMoves });
    })
    .catch((error) => {
      logger.error(error);
      next(error);
    });
};

// [ MOVE INSTANCE ]
exports.moves_instance_get = function (req, res, next) {
  const id = req.params.id;
  Move.findById(id)
    .then(({ id, name, effect, power, pp }) => {
      const nameCap = Array.from(name)
        .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
        .join('');
      const updateInstance = `${id}/update`;
      const deleteInstance = `${id}/delete`;
      res.render('moveInstance', {
        id,
        name,
        nameCap,
        effect,
        power,
        pp,
        updateInstance,
        deleteInstance,
      });
    })
    .catch((error) => {
      logger.error(error);
      next(error);
    });
};

// [ UPDATE INSTANCE GET ]
exports.moves_instance_update_get = function (req, res, next) {
  // TODO query move instance
  res.end('update');
};

// [ UPDATE INSTANCE POST ]
exports.moves_instance_update_post = function (req, res, next) {
  res.end('upate post');
  //
};
