const express = require('express');
const cartController = require('../app/controllers/cartController');
const router = express.Router();

router.get('/cart', cartController().index);
router.post('/update-cart', cartController().update);
router.post('/delete-cart-item', cartController().delete);

module.exports = router;