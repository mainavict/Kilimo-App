

const express = require('express');
const router = express.Router();
const { register,login } = require('../controllers/authController');
const {validateRegister, validateLogin} = require('../middleware/validation');
const { forgotPassword, resetPasswordController } = require('../controllers/passwordResetController');

router.post('/register', validateRegister, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword); 
router.post('/reset-password', resetPasswordController); 

module.exports = router;