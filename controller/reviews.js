const Review = require('../models/review');
const User = require('../models/user');

module.exports.showAllReviews = async(req, res) => {
    const id = req.params.id;
    const user = await User.findById(id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    });
    res.render('reviews/show', {user});
}

module.exports.createReview = async(req, res) =>{
    const review = new Review(req.body.review);
    review.author = req.user._id;
    await review.save();
    const id = req.params.id;
    const user = await User.findById(id);
    // user.rating = 0;
    // user.numberOfReview = 0;
    user.reviews.push(review._id);
    user.rating = (user.rating * user.numberOfReview + review.rating)/(user.numberOfReview + 1);
    user.numberOfReview++;
    await user.save();

    res.redirect(`/users/${id}/reviews`);
}

module.exports.deleteReview = async(req, res) =>{
    const id = req.params.id;
    const reviewId = req.params.reviewId;
    
    const user = await User.findById(id);
    const review = await Review.findById(reviewId);

    // update user rating
    user.numberOfReview--;
    console.log(user.numberOfReview);
    if (user.numberOfReview > 0){
        user.rating = (user.rating*(user.numberOfReview + 1)-review.rating)/user.numberOfReview;
    } else{
        user.rating = 0;
    }
    user.save();
    
    await user.updateOne({$pull: {reviews: {$in: reviewId}}});
    await Review.findByIdAndDelete(reviewId);
    
    res.redirect(`/users/${id}/reviews`);
}
