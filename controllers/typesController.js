const { type } = require('express/lib/response');
const { url } = require('inspector');
const path = require('path');
const { logger } = require(path.join(__dirname, '../logger'));
const Type = require(path.join(__dirname, '../models/type'));

exports.types_get = function (req, res, next) {
  // [ QUERY/FILTER MOVES DATA ]
  Type.find()
    .then((types) => {
      // [ RENDER TYPES ]
      const names = [];
      const filteredTypes = types.map(({ url, name }) => {
        const nameCap = Array.from(name)
          .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
          .join('');
        return {
          url,
          name,
          nameCap,
        };
      });
      logger.debug(names);
      res.render('types', { types: filteredTypes });
    })
    .catch((error) => logger.error(error));
};

exports.types_instance_get = function (req, res, next) {
  const id = req.params.id;
  Type.findById(id)
    .populate(
      'doubleDamageFrom doubleDamageTo halfDamageFrom halfDamageTo noDamageFrom noDamageTo'
    )
    .then(
      ({
        name,
        doubleDamageFrom,
        doubleDamageTo,
        halfDamageFrom,
        halfDamageTo,
        noDamageFrom,
        noDamageTo,
      }) => {
        const nameCap = Array.from(name)
          .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
          .join('');
        const ddf = doubleDamageFrom.map(({ name, url }) => {
          return { name, url };
        });
        const ddt = doubleDamageTo.map(({ name, url }) => {
          return { name, url };
        });
        const hdf = halfDamageFrom.map(({ name, url }) => {
          return { name, url };
        });
        const hdt = halfDamageTo.map(({ name, url }) => {
          return { name, url };
        });
        const ndf = noDamageFrom.map(({ name, url }) => {
          return { name, url };
        });
        const ndt = noDamageTo.map(({ name, url }) => {
          return { name, url };
        });
        res.render('typeInstance', {
          name: nameCap,
          ddf,
          ddt,
          hdf,
          hdt,
          ndf,
          ndt,
        });
      }
    )
    .catch((error) => logger.error(error));
};
