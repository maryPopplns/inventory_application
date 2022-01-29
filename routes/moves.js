const path = require('path');
const express = require('express');
const router = express.Router();
const { moves_get } = require(path.join(
  __dirname,
  '../controllers/movesController'
));

// [ GET POKEMON ]
router.get('/', moves_get);

module.exports = router;
