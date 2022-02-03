const path = require('path');
const express = require('express');
const router = express.Router();
const {
  pokemon_get,
  pokemon_instance_get,
  pokemon_instance_update_get,
  pokemon_instance_delete_get,
  pokemon_instance_update_post,
  pokemon_instance_delete_post,
} = require(path.join(__dirname, '../controllers/pokemonController'));

// [ GET POKEMON ]
router.get('/', pokemon_get);
router.get('/:id', pokemon_instance_get);
router.get('/:id/update', pokemon_instance_update_get);
router.post('/:id/update', pokemon_instance_update_post);
router.get('/:id/delete', pokemon_instance_delete_get);
router.post('/:id/delete', pokemon_instance_delete_post);

module.exports = router;
