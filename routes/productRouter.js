const express = require('express');
const menuController = require('../app/controllers/menuController');
const router = express.Router();

router.get('/products', menuController().index);

module.exports = router;