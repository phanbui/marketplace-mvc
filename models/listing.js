const mongoose = require('mongoose');
const { Schema } = mongoose;

require('mongoose-type-email');

const imageSchema = new mongoose.Schema({
    filename: String,
    url: String
})

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    description: {
        type: String
    },
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    images: [imageSchema]
});

const Listing = mongoose.model('Listing', listingSchema);

module.exports = Listing;