const express = require('express');
const menuController = require('../app/controllers/menuController');
const router = express.Router();

router.get('/products', menuController().index);
router.get('/products/:name', menuController().getCategory);

module.exports = router;