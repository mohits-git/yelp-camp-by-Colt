const mongoose = require('mongoose');

const Campground = require('../models/campground')

const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
    .then(() => {
        console.log("Mongo Connected Successfuly");
    })
    .catch((err) => {
        console.log("Oh No, Error in Connecting Mongo!!!!");
        console.log(err);
    })

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const index = Math.floor(Math.random() * 1000);
        const price = Math.floor((Math.random() * 20)) + 10;
        const camp = new Campground({
            author: '65801c2de5b0b606a3ed3b20',
            location: `${cities[index].city}, ${cities[index].state}`,
            title: `${sample(places)} ${sample(descriptors)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet rem provident mollitia ipsam repudiandae nihil fugiat illo officiis ut possimus? Et aperiam soluta autem, voluptate quaerat reprehenderit ipsam optio enim?',
            price
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})
