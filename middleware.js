const { campgroundSchema, reviewSchema } = require('./errorSchemas')
const Campground = require('./models/campground');
const AppError = require('./AppError.js')
const Review = require('./models/reviews');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){//isAuthenticated is available through passport
        req.session.redirectTo = req.originalUrl;
        req.flash('error', "Must Be Logged In");
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id)
    if(!campground.author.equals(req.user._id)){
        req.flash('error', 'You cannot do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId)
    if(!review.author.equals(req.user._id)){
        req.flash('error', 'You cannot do that');
        return res.redirect(`/campgrounds/${id}`)
    }
    next()
}

module.exports.validateCampground = (req, res, next) => {
    console.log(`Schema do be: ${campgroundSchema}`)
    const { error } = campgroundSchema.validate(req.body);
    
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        console.log("Validate found an error")
        throw new AppError(msg, 400);
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    console.log('Body:')
    console.log(req.body)
    const { error } = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        console.log("Validate found an error")
        throw new AppError(msg, 400);
    }else{
        next();
    }
}
