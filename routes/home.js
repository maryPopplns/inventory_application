const path = require('path');
const express = require('express');
const router = express.Router();
const { home_get } = require(path.join(
  __dirname,
  '../controllers/homeController'
));

/* GET home page. */
router.get('/', home_get);

module.exports = router;
