const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const Joi = require('joi');
const {campgroundSchema , reviewSchema}= require('./schemas.js');
const Review = require('./models/review.js')

const Campground = require('./models/campground');

const ExpressError = require('./utils/ExpressErrors');
const catchAsync = require('./utils/catchAsync');
const campground = require('./models/campground');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Mongo Connected Successfuly");
    })
    .catch((err) => {
        console.log("Oh No, Error in Connecting Mongo!!!!");
        console.log(err);
    })

const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateCampgroundSchema = function (req, res, next) {
    const { error } = campgroundSchema.validate(req.body);

    if (error) {
        let msg = error.details.map(e => e.message).join(',');
        throw new ExpressError(msg, 400);
    }
    else {
        next();
    }
}

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


app.get('/', (req, res, next) => {
    res.render('home');
})

app.get('/campgrounds', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

app.get('/campgrounds/new', (req, res, next) => {
    res.render('campgrounds/new');
})

app.post('/campgrounds', validateCampgroundSchema, catchAsync(async (req, res, next) => {
    //    if(!req.body.campground) throw new ExpressError("Invalid Data", "400");

    const camp = new Campground(req.body.campground);
    await camp.save();
    res.redirect(`/campgrounds/${camp._id}`);
}))

app.get('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    res.render('campgrounds/show', { campground });
}))
app.get('/campgrounds/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))
app.put('/campgrounds/:id', validateCampgroundSchema, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    res.redirect(`/campgrounds/${id}`);
}))
app.delete('/campgrounds/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds');
}))
app.post('/campgrounds/:id/reviews', validateReviewSchema, catchAsync(async(req, res, next) => {
    const camp = await Campground.findById(req.params.id)
    const review = new Review(req.body.review); 
    camp.reviews.push(review);
    await review.save();
    await camp.save();
    res.redirect(`/campgrounds/${camp.id}`);
}))
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async(req,res, next) => {
    const {id, reviewId} = req.params;
    await Campground.findByIdAndUpdate(id, {$pull : {reviews : reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`);
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = "Something Went Wrong";
    res.status(statusCode).render('error', { err });
})

app.listen(3000, () => {
    console.log("Serving at Port 3000");
})
