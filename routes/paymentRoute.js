const express = require('express');
const payment = require('../controllers/paymentController');
const router = express.Router();

router.post('/createPayment', payment);

module.exports = router;