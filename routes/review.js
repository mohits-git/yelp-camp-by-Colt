const express = require('express')
const router = express.Router({mergeParams: true});
const ExpressError = require('../utils/ExpressErrors');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground')
const Review = require('../models/review')
const { reviewSchema } = require('../schemas')

const validateReviewSchema = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

router.post('/', validateReviewSchema, catchAsync(async(req, res, next) => {
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review); 
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', "Successfully Added the Review on your campground");
    res.redirect(`/campgrounds/${camp.id}`);
}))
router.delete('/:reviewId', catchAsync(async(req,res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully Deleted the Review on your campground");
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;
