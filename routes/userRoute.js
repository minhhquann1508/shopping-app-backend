const express = require('express');
const {
    getAllUser,
    getSingleUser,
    getCurrentUser,
    updateUser,
    deleteUser
} = require('../controllers/userController');
const { authenticateUser, authorizePermissions } = require('../middleware/authentication');

const router = express.Router();

router
    .route('/')
    .get(authenticateUser, authorizePermissions('admin'), getAllUser);

router
    .route('/showMe')
    .get(authenticateUser, getCurrentUser);

router
    .route('/:id')
    .get(authenticateUser, authorizePermissions('admin'), getSingleUser)
    .patch(authenticateUser, updateUser)
    .delete(authenticateUser, authorizePermissions('admin'), deleteUser);

module.exports = router;