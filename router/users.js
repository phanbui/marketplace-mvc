const express = require('express');
const router = express.Router({mergeParams: true});

const User = require('../models/user');

const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', async(req, res) => {
    const {username, password, email} = req.body;
    const user = new User({username: username, email: email});
    registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) { 
            res.redirect('/listings');
        }
    });
    res.redirect('/listings');
})

router.get('/login', (req, res) => {
    res.render('users/login');
})

router.post('/login', 
    passport.authenticate('local', { failureRedirect: '/login' }),
    function(req, res) {
        const link = req.session.returnTo || '/listings';
        res.redirect(link);
});

router.post('/logout', function(req, res){
    req.logout();
    res.redirect('/login');
});

module.exports = router;