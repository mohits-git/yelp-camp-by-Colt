const mongoose = require('mongoose');
const Review = require('./review.js')
const Schema = mongoose.Schema;

const campgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
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
