const express = require('express');
const cartController = require('../app/controllers/cartController');
const orderController = require('../app/controllers/orderController');
const router = express.Router();

router.get('/cart', cartController().index);
router.post('/update-cart', cartController().update);
router.post('/delete-cart-item', cartController().delete);

router.get('/track-order', orderController().index);
router.get('/track-order/:order_id', orderController().orderDetails);

router.post('/post-order', orderController().postOrder);

module.exports = router;