const path = require('path');
const express = require('express');
const router = express.Router();
const { types_get } = require(path.join(
  __dirname,
  '../controllers/typesController'
));

// [ GET POKEMON ]
router.get('/', types_get);

module.exports = router;
