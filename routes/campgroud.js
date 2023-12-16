const express = require('express')
const route = express.Router();
const ExpressError = require('../utils/ExpressErrors');
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const {campgroundSchema} = require('../schemas')

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

route.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
route.get('/new', (req, res, next) => {
    res.render('campgrounds/new');
})
route.post('/', validateCampgroundSchema, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    await camp.save();
    req.flash('success', "Successfully saved your campground");
    res.redirect(`/campgrounds/${camp._id}`);
}))
route.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Could not find Campground')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))
route.get('/:id/edit', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    res.render('campgrounds/edit', { campground });
}))
route.put('/:id', validateCampgroundSchema, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', "Successfully updated your campground");
    res.redirect(`/campgrounds/${id}`);
}))
route.delete('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted your campground");
    res.redirect('/campgrounds');
}))

module.exports = route;
