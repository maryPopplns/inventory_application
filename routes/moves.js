const path = require('path');
const express = require('express');
const router = express.Router();
const {
  moves_get,
  moves_instance_get,
  moves_instance_update_get,
  moves_instance_update_post,
  moves_instance_delete_get,
  moves_instance_delete_post,
} = require(path.join(__dirname, '../controllers/movesController'));

// [ GET POKEMON ]
router.get('/', moves_get);
router.get('/:id', moves_instance_get);
router.get('/:id/update', moves_instance_update_get);
router.post('/:id/update', moves_instance_update_post);
router.get('/:id/delete', moves_instance_delete_get);
router.post('/:id/delete', moves_instance_delete_post);

module.exports = router;
