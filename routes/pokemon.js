const path = require('path');
const express = require('express');
const router = express.Router();
const {
  pokemon_get,
  pokemon_instance_get,
  pokemon_instance_update_get,
  pokemon_instance_delete_get,
} = require(path.join(__dirname, '../controllers/pokemonController'));

// [ GET POKEMON ]
router.get('/', pokemon_get);
router.get('/:id', pokemon_instance_get);
router.get('/:id/update', pokemon_instance_update_get);
router.get('/:id/delete', pokemon_instance_delete_get);

module.exports = router;
