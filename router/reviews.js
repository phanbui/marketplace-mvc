const express = require('express');
const router = express.Router({mergeParams: true});

const Review = require('../models/review');
const User = require('../models/user');

// controller
const listingController = require('../controller/reviews');

// middleware
const {isLoggedIn, isReviewAuthor} = require('../middleware');

router.get('/', listingController.showAllReviews)

router.post('/', isLoggedIn, listingController.createReview)

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, listingController.deleteReview)

module.exports = router;