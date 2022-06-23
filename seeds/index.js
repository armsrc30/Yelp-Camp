const mongoose = require('mongoose')

const cities = require('./cities');
const Campground = require('../models/campground')

const {places, descriptors} = require('./seedHelpers')

console.log("1")

const mapboxToken = 'pk.eyJ1IjoiYXJtc3JjMzAiLCJhIjoiY2t3cGtjMGZtMGRndTJwbnE1aG8zMTQxMCJ9.kvX6MRdxo0SedJu9T7u7zw'
console.log("2")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
console.log("3")
console.log(mapboxToken)
const geoCoder = mbxGeocoding({accessToken: mapboxToken});





function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

let imgs = [
    {
        url: 'https://res.cloudinary.com/dv62k5cai/image/upload/v1638484753/YelpCamp/atgjamwndddfmn6jczbh.jpg',
        filename: 'YelpCamp/atgjamwndddfmn6jczbh',
        
    },
    {
        url: 'https://res.cloudinary.com/dv62k5cai/image/upload/v1638484753/YelpCamp/u2cbp14tuymds8k9w7zd.jpg',
        filename: 'YelpCamp/u2cbp14tuymds8k9w7zd',
        
    },
    {
        url: 'https://res.cloudinary.com/dv62k5cai/image/upload/v1638484753/YelpCamp/wst8gmp8anpmcg4cjnwh.jpg',
        filename: 'YelpCamp/wst8gmp8anpmcg4cjnwh',
       
    },
    {
        url: 'https://res.cloudinary.com/dv62k5cai/image/upload/v1638484753/YelpCamp/nhibnyjm73o9y9iprreo.jpg',
        filename: 'YelpCamp/nhibnyjm73o9y9iprreo',
        
    }
]

mongoose.connect('mongodb://localhost:27017/yelp-camp', { useNewUrlParser: true, useUnifiedTopology: true }).then(() => {
    console.log("Connection Open!");
})
.catch(err => {
    console.log("Could not Connect")
})

//Function to choose random place and descriptor in the 'places' and 'descriptors' arrays from seedHelpers file
const sample = array => array[Math.floor(Math.random() * array.length)]

//Randomly generate location and titles and save to data base
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 200; i++){
        const randomCity = Math.floor(Math.random() * 1000);
        let random = getRandomInt(4);
        cityState = `${cities[randomCity].city}, ${cities[randomCity].state}`;
        /*const geoData = await geoCoder.forwardGeocode({
            query: cityState,
            limit: 1
        }).send()*/

        
        
        const camp = new Campground({
            location: `${cities[randomCity].city}, ${cities[randomCity].state}`,
            location: cityState,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: Math.floor(Math.random() * 40) + 10,
            description: 'This is a generic Campground',
            author: '614bc38e966ece079ca2050c',
            geometry: {
                type: 'Point',
                coordinates: [cities[randomCity].longitude, cities[randomCity].latitude]
            },
            images: [
               imgs[random]
            ]
        })
        await camp.save()
    }

}

seedDB();