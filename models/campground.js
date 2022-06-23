const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user')
const Review = require('./reviews')


const imageSchema = new Schema({
    url: String,
    filename: String
})

imageSchema.virtual('thumbnail').get(function() {
    //Turns images into thumbnails using cloudinary image transformation API
    //Isnt stored in database. This is a virtual property
    return this.url.replace('/upload', '/upload/w_100')
})


//This allows virtual properties to be used in JSON. Is passed into the end of campground Schema
const opts = { toJSON: {virtuals: true}}

const campgroundSchema = new Schema({
    title: {
        type: String,
        required: true
    } ,
    price: {
        type: Number,
        required: true,
        default: 0
    },
    description: String,
    location: {
        type: String,
        required: true
    },
    images: [imageSchema],
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: [{
            type: Number,
            required: true
        }]
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],

    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },

}, opts)


campgroundSchema.virtual('properties.popUpMarkup').get(function() {
    
    return `
    <strong><a href="/campgrounds/${this._id}">${this.title}</a></strong>
    <p>${this.location}</p>`
})

campgroundSchema.post('findOneAndDelete', async function (doc) {
    if(doc){
        console.log("Before")
        console.log(doc)
        console.log("After")
        await Review.remove({
            _id: {
                $in: doc.review
            }
        })
    }
})

const Campground = mongoose.model('Campground', campgroundSchema);
module.exports = Campground;