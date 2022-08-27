const express = require('express');
const userController = require('../app/controllers/userController');
const guest = require('../app/middlewares/guest');
const router = express.Router();

router.get('/login', guest, userController().getLogin);
router.post('/login', userController().postLogin);

router.get('/register', guest, userController().getRegister);
router.post('/register', userController().postRegister);
 
router.post('/logout', userController().logout);
module.exports = router;