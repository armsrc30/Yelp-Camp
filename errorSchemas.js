const Joi = require('joi');
const Review = require('./models/reviews');

/*module.exports.campgroundSchema = Joi.object({
    Campground: Joi.object({
        title: Joi.string().required(),
        price: Joi.number().required().min(0),
        image: Joi.string().required(),
        location: Joi.string().required(),
        description: Joi.string().required()
    }).required()
})*/



module.exports.campgroundSchema = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required().min(0),
    image: [
        Joi.string().required(),
        Joi.string().required()
    ],
    location: Joi.string().required(),
    description: Joi.string().required(),
    deleteImages: Joi.array()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        body: Joi.string().required(),
        rating: Joi.number().required()
    }).required()
})