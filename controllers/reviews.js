const Dentist = require('../models/dentist');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const dentist = await Dentist.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    dentist.reviews.push(review);
    await review.save();
    await dentist.save();
    req.flash('success', 'Successfully made a new review!');
    res.redirect(`/dentists/${dentist._id}`);
};

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Dentist.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/dentists/${id}`);
};
