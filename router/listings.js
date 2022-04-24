const express = require('express');
const router = express.Router({mergeParams: true});

// controller
const listingController = require('../controller/listings');

// middleware
const {isLoggedIn, isAuthor} = require('../middleware');

// multer
const {cloudinary, storage} = require('../cloudinary/index');
const multer  = require('multer')
const upload = multer({ storage });

router.route('/')
    .get(listingController.showAllListings)
    .post(isLoggedIn, upload.array('images'), listingController.createListing)

router.get('/new', isLoggedIn, listingController.renderNewForm)

router.route('/:id')
    .get(listingController.showListing)
    .put(isLoggedIn, isAuthor, upload.array('images'), listingController.editListing)
    .delete(isLoggedIn, isAuthor, listingController.deleteListing)

router.get('/:id/edit', isLoggedIn, isAuthor, listingController.renderEditForm)

module.exports = router;