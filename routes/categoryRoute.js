const express = require('express');
const {
    createCategory,
    getAllCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication')
const router = express.Router();

router
    .route('/')
    .post(authenticateUser, authorizePermissions('admin'), createCategory)
    .get(getAllCategory);

router
    .route('/:id')
    .patch(authenticateUser, authorizePermissions('admin'), updateCategory)
    .delete(authenticateUser, authorizePermissions('admin'), deleteCategory)


module.exports = router;