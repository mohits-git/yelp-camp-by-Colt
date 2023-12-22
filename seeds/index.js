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
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Eveniet rem provident mollitia ipsam repudiandae nihil fugiat illo officiis ut possimus? Et aperiam soluta autem, voluptate quaerat reprehenderit ipsam optio enim?',
            price,
            images: [{
                url: 'https://res.cloudinary.com/djdsjlgxy/image/upload/v1703227401/YelpCamp/rchu9iwwrrfgcfg2ffil.jpg',
                filename: 'YelpCamp/rchu9iwwrrfgcfg2ffil',
                },
                {
                    url: 'https://res.cloudinary.com/djdsjlgxy/image/upload/v1703227403/YelpCamp/yieh3g3tcdtlgtezpfyu.jpg',
                    filename: 'YelpCamp/yieh3g3tcdtlgtezpfyu',
                },
                {
                    url: 'https://res.cloudinary.com/djdsjlgxy/image/upload/v1703227407/YelpCamp/g1p9oadb3lzmjly8f1wq.jpg',
                    filename: 'YelpCamp/g1p9oadb3lzmjly8f1wq',
                }]
        })
        await camp.save();
    }
}


seedDB().then(() => {
    mongoose.connection.close();
})
