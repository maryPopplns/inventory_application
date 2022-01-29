const { type } = require('express/lib/response');
const { url } = require('inspector');
const path = require('path');
const { logger } = require(path.join(__dirname, '../logger'));
const Type = require(path.join(__dirname, '../models/type'));

exports.types_get = function (req, res, next) {
  // [ QUERY/FILTER MOVES DATA ]
  Type.find({})
    // .limit(1)
    .then((types) => {
      // [ RENDER TYPES ]
      const names = [];
      const filteredTypes = types.map(({ url, name }) => {
        const nameCap = Array.from(name)
          .map((letter, index) => (index === 0 ? letter.toUpperCase() : letter))
          .join('');
        return {
          url,
          name: nameCap,
        };
      });
      logger.debug(names);
      res.render('types', { types: filteredTypes });
    })
    .catch((error) => logger.error(error));
};
