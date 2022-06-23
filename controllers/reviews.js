const Review = require('../models/reviews');
const Campground = require('../models/campground');

module.exports.createReview = async(req, res, next) => {
    const{ id } = req.params;
    const camp = await Campground.findById(id)
    const review = new Review(req.body.review);
    review.author = req.user._id
    camp.review.push(review);
    await review.save();
    await camp.save();
    console.log("Author of Review:")
    console.log(review.author)
    req.flash('success', 'Successfully Made New Review')
    res.redirect(`/campgrounds/${id}`);
}

module.exports.deleteReview = async (req, res, next) => {
    const { id } = req.params;
    const { reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { review: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/campgrounds/${id}`)
}