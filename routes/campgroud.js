const express = require('express')
const route = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampgroundSchema, isAuthor } = require('../middleware')

route.get('/', catchAsync(async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))
route.get('/new', isLoggedIn, (req, res, next) => {
    res.render('campgrounds/new');
})
route.post('/', isLoggedIn, validateCampgroundSchema, catchAsync(async (req, res, next) => {
    const camp = new Campground(req.body.campground);
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', "Successfully saved your campground");
    res.redirect(`/campgrounds/${camp._id}`);
}))
route.get('/:id', catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('author');
    if(!campground) {
        req.flash('error', 'Could not find Campground')
        return res.redirect('/campgrounds');
    }
    console.log(campground)
    res.render('campgrounds/show', { campground });
}))
route.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Could not find Campground')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))
route.put('/:id', isLoggedIn, isAuthor, validateCampgroundSchema, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    req.flash('success', "Successfully updated your campground");
    res.redirect(`/campgrounds/${id}`);
}))
route.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted your campground");
    res.redirect('/campgrounds');
}))

module.exports = route;
