const path = require('path');
const express = require('express');
const router = express.Router();
const { pokemon_get } = require(path.join(
  __dirname,
  '../controllers/pokemonController'
));

// [ GET POKEMON ]
router.get('/', pokemon_get);

module.exports = router;
