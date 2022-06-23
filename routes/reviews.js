const express = require('express');
const router = express.Router({ mergeParams: true });
const Campground = require('../models/campground');
const Review = require('../models/reviews');
const AppError = require('../AppError.js')
const { reviewSchema } = require('../errorSchemas')
const methodOverride = require('method-override')
const { validateReview, isLoggedIn, isReviewAuthor} = require('../middleware');
const reviews = require("../controllers/reviews")

router.use(express.urlencoded({ extended: true}))//Allows you to parse

router.use(methodOverride('_method'))//Allows _method to be used in the action of a form

function wrapAsync(fn){
    return function(req, res, next){
        fn(req, res, next).catch(e => next(e))
    }
}





router.post('/', isLoggedIn, validateReview, wrapAsync(reviews.createReview))



router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(reviews.deleteReview))

module.exports = router;