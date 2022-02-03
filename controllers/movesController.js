const path = require('path');
const async = require('async');
const { logger } = require(path.join(__dirname, '../logger'));
const Type = require(path.join(__dirname, '../models/type'));
const Move = require(path.join(__dirname, '../models/move'));
const Pokemon = require(path.join(__dirname, '../models/pokemon'));
const { check, validationResult } = require('express-validator');

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
  Move.findById(req.params.id)
    .then(({ name, effect, power, pp }) => {
      const nameCap = Array.from(name)
        .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
        .join('');
      res.render('moveInstanceGet', { name: nameCap, effect, power, pp });
    })
    .catch((error) => {
      logger.error(error);
      next(error);
    });
};

// [ UPDATE INSTANCE POST ]
exports.moves_instance_update_post = [
  check('name').trim().escape(),
  check('power').trim().escape(),
  check('pp').trim().escape(),
  check('effect').trim().escape(),
  function (req, res, next) {
    async.series(
      {
        type: function (callback) {
          Move.findById(req.params.id)
            .then(({ type }) => {
              callback(null, type);
            })
            .catch((error) => {
              callback(error);
            });
        },
      },
      function (error, results) {
        if (error) {
          logger.error(error);
          next(error);
        } else {
          const move = new Move({
            name: req.body.name,
            power: req.body.power,
            pp: req.body.pp,
            effect: req.body.effect,
            type: results.type,
            _id: req.params.id,
          });
          Move.findByIdAndUpdate(
            req.params.id,
            move,
            {},
            function (error, theMove) {
              if (error) {
                logger.error(error);
                next(error);
              } else {
                res.redirect(theMove.url);
              }
            }
          );
        }
      }
    );
  },
];

exports.moves_instance_delete_get = function (req, res, next) {
  Move.findById(req.params.id)
    .then(({ name }) => {
      const nameCap = Array.from(name)
        .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
        .join('');
      res.render('deleteMoveGet', { name: nameCap, errors: false });
    })
    .catch((error) => {
      logger.error(error);
      next(error);
    });
};

exports.moves_instance_delete_post = [
  check('deleteMove').trim().escape(),
  function (req, res, next) {
    // [ INCORRECT PASSWORD ]
    if (req.body.deleteMove !== process.env.DELETE_PASSWORD) {
      Move.findById(req.params.id)
        .then(({ name }) => {
          const nameCap = Array.from(name)
            .map((letter, index) =>
              index === 0 ? letter.toUpperCase() : letter
            )
            .join('');
          res.render('deleteMoveGet', { name: nameCap, errors: true });
        })
        .catch((error) => {
          logger.error(error);
          next(error);
        });
      // [ CORRECT PASSWORD ]
    } else {
      Move.findByIdAndDelete(req.params.id)
        .then(() => {
          res.redirect('/moves');
        })
        .catch((error) => {
          logger.error(error);
          next(error);
        });
    }
  },
];
