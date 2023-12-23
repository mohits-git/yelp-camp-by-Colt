const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mbxToken });


module.exports.index = async (req, res, next) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}

module.exports.renderNewForm = (req, res, next) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1
    }).send()
    if(!geoData.body.features.length){
        return next(new Error("Please Enter a Valid Location"));
    }
    const camp = new Campground(req.body.campground);
    camp.geometry = geoData.body.features[0].geometry
    camp.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.author = req.user._id;
    await camp.save();
    req.flash('success', "Successfully saved your campground");
    res.redirect(`/campgrounds/${camp._id}`);
}

module.exports.showCampground = async (req, res, next) => {
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
    res.render('campgrounds/show', { campground });
}

module.exports.renderEditForm = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if(!campground) {
        req.flash('error', 'Could not find Campground')
        return res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}

module.exports.updateCampground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    camp.images.push(...imgs);
    await camp.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await camp.updateOne({$pull: { images: { filename : { $in : req.body.deleteImages}}}})
    }
    req.flash('success', "Successfully updated your campground");
    res.redirect(`/campgrounds/${id}`);
}

module.exports.destroyCampground = async (req, res, next) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);
    req.flash('success', "Successfully deleted your campground");
    res.redirect('/campgrounds');
}
