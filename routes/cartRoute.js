const express = require('express');
const { authenticateUser } = require('../middleware/authentication');
const {
    createCart,
    getCurrentUserCart,
    changCartItemQuantity,
    deleteCartItem
} = require('../controllers/cartController');
const router = express.Router();

router
    .route('/')
    .post(authenticateUser, createCart)
    .get(authenticateUser, getCurrentUserCart);

router
    .route('/updateItemQuantity')
    .patch(authenticateUser, changCartItemQuantity)

router
    .route('/:id')
    .patch(authenticateUser, changCartItemQuantity)
    .delete(authenticateUser, deleteCartItem);

module.exports = router;