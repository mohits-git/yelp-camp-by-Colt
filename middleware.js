const Campground = require('./models/campground')
const Review = require('./models/review')
const { campgroundSchema, reviewSchema } = require('./schemas')
const ExpressError = require('./utils/ExpressErrors')

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Please Login')
        return res.redirect('/login')
    }
    next();
}

module.exports.storeReturnTo = (req, res, next) => {
    if(req.session.returnTo){
        res.locals.returnTo = req.session.returnTo;
    }
    next();
}

module.exports.validateCampgroundSchema = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        let msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isAuthor = async function(req, res, next) {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', "Sorry! You are not Authorized");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.validateReviewSchema = function (req, res, next) {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

module.exports.isReviewAuthor = async function(req, res, next) {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "Sorry! You are not Authorized");
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}
