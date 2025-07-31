const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/authController');
const authenticate = require('../Middleware/AuthMiddleware');


router.post('/register', LoginController.registerUser);

router.post('/login', LoginController.login);

router.post('/logout', authenticate, LoginController.logout);


module.exports = router;
