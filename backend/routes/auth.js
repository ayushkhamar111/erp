const express = require('express');
const router = express.Router();
const LoginController = require('../controllers/authController'); 

router.post('/register', LoginController.registerUser);

router.post('/login', LoginController.login);

module.exports = router;
