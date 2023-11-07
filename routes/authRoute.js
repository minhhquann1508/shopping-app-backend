const express = require('express');
const {
    register,
    login,
    verifyEmail,
    forgotPassword,
    resetPassword,
    logout
} = require('../controllers/authController');
const { authenticateUser } = require('../middleware/authentication');

const router = express.Router();

router.route('/register').post(register);
router.route('/verify-email').post(verifyEmail);
router.route('/forgot-password').post(forgotPassword);
router.route('/reset-password').post(resetPassword);
router.route('/login').post(login);
router.route('/logout').delete(authenticateUser, logout);

module.exports = router;