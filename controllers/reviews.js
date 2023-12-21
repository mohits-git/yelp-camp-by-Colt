const Campground = require('../models/campground')
const Review = require('../models/review')

module.exports.createReview = async(req, res, next) => {
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review); 
    review.author = req.user._id;
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    req.flash('success', "Submitted your Review :)");
    res.redirect(`/campgrounds/${camp.id}`);
}

module.exports.destroyReview = async(req,res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', "Successfully Deleted the Review");
    res.redirect(`/campgrounds/${id}`);
}
