const express = require("express");
const router = express.Router({mergeParams:true});
const reviews = require('../controllers/reviews');
const catchAsync = require('../utils/catchAsync');
// const ExpressError = require('../utils/ExpressError');
// const Dentist = require('../models/dentist');
// const Review = require('../models/review');
// const { reviewSchema } = require('../schemas.js');
const {isLoggedIn, isReviewAuthor, validateReview} = require('../middleware');


router.post('/', validateReview, isLoggedIn, catchAsync(reviews.createReview));
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));   

module.exports = router;