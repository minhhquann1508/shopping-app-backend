const express = require('express');
const {
    createProduct,
    getAllProduct,
    getSingleProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage
} = require('../controllers/productController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication')

const router = express.Router();

router
    .route('/')
    .get(getAllProduct)
    .post(authenticateUser, authorizePermissions('admin'), createProduct);

router
    .route('/uploadImage/:productId')
    .post(authenticateUser, authorizePermissions('admin'), uploadProductImage);

router
    .route('/:id')
    .get(getSingleProduct)
    .patch(authenticateUser, authorizePermissions('admin'), updateProduct)
    .delete(authenticateUser, authorizePermissions('admin'), deleteProduct);

module.exports = router;