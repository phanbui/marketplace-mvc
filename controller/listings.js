const Listing = require('../models/listing');

const {cloudinary, storage} = require ('../cloudinary/index');

module.exports.showAllListings = async(req, res) => {
    const listings = await Listing.find();
    res.render('listings/index', {listings});
}

module.exports.showListing = async(req, res) => {
    const id = req.params.id;
    const listing = await Listing.findById(id).populate('author');
    res.render('listings/show', {listing});
}

module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
}

module.exports.createListing = async(req, res) => {
    const listing = new Listing(req.body.listing);
    listing.author = req.user._id;
    listing.email = req.user.email;
    if (req.files.length > 0){
        listing.images = req.files.map(image => ({filename: image.filename, url: image.path}));
    }
    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}

module.exports.renderEditForm = async(req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/edit', {listing});
}

module.exports.editListing = async(req, res) => {
    const id = req.params.id;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    if (req.files.length > 0){
        const newImages = req.files.map(image => ({filename: image.filename, url: image.path}));
        listing.images.push(...newImages);
    }
    
    for (let filename of req.body.deleteFilenames){
        cloudinary.uploader.destroy(filename);
    }
    await listing.updateOne({$pull: {images: {filename: {$in: req.body.deleteFilenames}}}});

    await listing.save();
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteListing = async(req, res) => {
    const id = req.params.id;

    // free space in cloudinary
    const listing = await Listing.findById(id);
    for(let image of listing.images){
        cloudinary.uploader.destroy(image.filename);
    }

    await Listing.findByIdAndDelete(id);
    res.redirect('/listings');
}