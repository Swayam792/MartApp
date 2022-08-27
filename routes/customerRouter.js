const express = require('express');
const cartController = require('../app/controllers/cartController');
const orderController = require('../app/controllers/orderController');
const auth = require('../app/middlewares/auth')

const router = express.Router();

router.get('/cart', cartController().index);
router.post('/update-cart', cartController().update);
router.post('/delete-cart-item', cartController().delete);

router.get('/track-order',auth , orderController().index);
router.get('/track-order/:order_id', auth, orderController().orderDetails);
router.post('/track-order/cancel-order', auth, orderController().cancelOrder);

router.post('/post-order',auth, orderController().postOrder);

module.exports = router;