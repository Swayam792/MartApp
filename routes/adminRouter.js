const express = require('express');
const adminController = require('../app/controllers/adminController');
const router = express.Router();

router.get('/admin', adminController().index);
router.get('/admin/manage-items', adminController().manage_items);
router.post('/admin/post-item', adminController().postItem);
router.post('/admin/update-post', adminController().updateItem);
router.post('/admin/delete-post', adminController().deleteItem);
router.get('/admin/manage-orders', adminController().manageOrder)

module.exports = router;