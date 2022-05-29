const express = require('express');
const userController = require('../app/controllers/userController');
const router = express.Router();

router.get('/login', userController().getLogin);
router.post('/login', userController().postLogin);

router.get('/register', userController().getRegister);
router.post('/register', userController().postRegister);
 
router.post('/logout', userController().logout);
module.exports = router;