const express = require('express')
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const Review = require('../models/review')
const { validateReviewSchema, isLoggedIn, isReviewAuthor } = require('../middleware')

router.post('/', isLoggedIn, validateReviewSchema, catchAsync(async(req, res, next) => {
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review); 
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', "Submitted your Review :)");
    res.redirect(`/campgrounds/${camp.id}`);
}))
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req,res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully Deleted the Review");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
