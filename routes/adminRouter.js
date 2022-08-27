const express = require('express');
const adminController = require('../app/controllers/adminController');
const orderStatusController = require('../app/controllers/orderStatusController');
const admin = require('../app/middlewares/admin');

const router = express.Router();

router.get('/admin', admin  ,adminController().index);
router.get('/admin/manage-items', admin , adminController().manage_items);
router.post('/admin/post-item', admin , adminController().postItem);
router.post('/admin/update-post', admin, adminController().updateItem);
router.post('/admin/delete-post', admin, adminController().deleteItem);
router.get('/admin/manage-orders', admin, adminController().manageOrder);
router.post('/admin/order-status', admin, orderStatusController().update);

module.exports = router;