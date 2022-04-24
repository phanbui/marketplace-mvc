const Listing = require('./models/listing');
const Review = require('./models/review');

module.exports.isLoggedIn = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    if (!req.isAuthenticated()){
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const id = req.params.id;
    const listing = await Listing.findById(id);
    if(!listing.author.equals(req.user._id)){
        res.redirect(`/listings/${id}`);
    }
    next();
}
module.exports.isReviewAuthor = async(req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId).populate('author');
    if (!review.author.equals(req.user._id)){
        return res.redirect(`/users/${id}/reviews`);
    }
    next();
}