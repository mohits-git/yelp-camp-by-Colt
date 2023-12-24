const mongoose = require('mongoose');
const Review = require('./review.js');
const Schema = mongoose.Schema;

//to get an transformation on Image...
//https://res.cloudinary.com/demo/image/upload/c_thumb,g_face,h_200,w_200/r_max/f_auto/woman-blackdress-stairs.png

const opts = { toJSON : { virtuals : true }}

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumbnail').get(function() {
    return this.url.replace('/upload', '/upload/w_200/');
})

const campgroundSchema = new Schema({
    title: String,
    images:[ImageSchema], 
    price: Number,
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, 
            ref: "Review"
        }
    ]
}, opts)

campgroundSchema.virtual('properties.popupMarkup').get(function() {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
        <p>${this.location}</p>`
}) 



campgroundSchema.post('findOneAndDelete', async function(doc) {
    if(doc) {
        await Review.deleteMany({
            _id: { $in : doc.reviews}
        })
    }
})
campgroundSchema.post('deleteMany', async function(doc) {
    if(doc) {
        await Review.deleteMany({})
    }
})

module.exports = mongoose.model('Campground', campgroundSchema)
