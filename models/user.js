const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

require('mongoose-type-email');

const User = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: mongoose.SchemaTypes.Email,
        required: true
    },
    rating: {
        type: Number,
        default: 0
    },
    numberOfReview: {
        type: Number,
        default: 0
    },
    reviews: [{type: Schema.Types.ObjectId, ref: 'Review'}]
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);