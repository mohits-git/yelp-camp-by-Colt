const express = require('express')
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews')
const { validateReviewSchema, isLoggedIn, isReviewAuthor } = require('../middleware')

router.post('/', isLoggedIn, validateReviewSchema, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.destroyReview))

module.exports = router;
