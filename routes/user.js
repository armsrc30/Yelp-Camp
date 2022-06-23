const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user')
const passport = require('passport')
const localStrategy = require('passport-local');
const { isLoggedIn } = require('../middleware');
const session = require('express-session')




const sessionConfig = {
    secret: 'thisIsASecret',
    resave: false,
    saveUninitialized: true
}
router.use(passport.initialize());

router.use(passport.session())
router.use(session(sessionConfig));



router.use(express.urlencoded({ extended: true}))//Allows you to parse
passport.use(new localStrategy(User.authenticate()))
const localAuth = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) //authenticates locally. Can also set it to twitter/facebook

router.get('/login', (req, res) => {
    
    res.render('users/login')
})


router.post('/login', [localAuth, isLoggedIn], async(req, res) => {
    req.flash('success', `Welcome Back!`);
    //req.session.redirectTo = req.originalUrl;
    //const redirectUrl = session.returnTo || '/campgrounds';
    const redirectUrl = req.session.redirectTo || '/campgrounds';
    res.redirect(redirectUrl)
})

router.get('/register', (req, res) => {
    res.render('users/register')
})

router.post('/register', isLoggedIn, async(req, res) => {
    try{
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            
            req.flash('success', 'Welcome!');
            res.redirect('/campgrounds');
        })
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register')
    }
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', "You've Been Logged Out")
    res.redirect('/campgrounds')
})
module.exports = router;