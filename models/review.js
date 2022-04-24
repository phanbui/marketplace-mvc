const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new mongoose.Schema({
    rating: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {type: Schema.Types.ObjectId, ref: 'User'},
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;