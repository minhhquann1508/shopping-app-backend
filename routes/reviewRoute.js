const express = require('express');
const {
    createReview,
    getSingleReview,
    updateReview,
    deleteReview
} = require('../controllers/reviewController');
const { authenticateUser } = require('../middleware/authentication');

const router = express.Router();

router
    .route('/')
    .post(authenticateUser, createReview);

router
    .route('/:id')
    .get(getSingleReview)
    .patch(authenticateUser, updateReview)
    .delete(authenticateUser, deleteReview);

module.exports = router;