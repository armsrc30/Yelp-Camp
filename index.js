const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
//const Joi = require('joi');
const { campgroundSchema, reviewSchema } = require('./errorSchemas')
const methodOverride = require('method-override') //To have put or patch requests. Must npm i method-override first
//const Campground = require('./models/campground');
//const { findByIdAndUpdate } = require('./models/campground');
const ejsMate = require('ejs-mate');
//const AppError = require('./AppError.js')
const Review = require('./models/reviews');
const session = require('express-session')
const flash = require('connect-flash');
const passport = require('passport');
const localStrategy = require('passport-local');
const User = require('./models/user')


const userRoutes = require('./routes/user')
const campgroundsRoutes = require('./routes/campgrounds');
const reviewsRoutes = require('./routes/reviews');

if(process.env.NODE_ENV != "production"){
    require('dotenv').config()
}

console.log(process.env.CLOUDINARY_CLOUD_NAME)
console.log(process.env.CLOUDINARY_KEY)

mongoose.connect('mongodb://localhost:27017/yelp-camp', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    //useCreateIndex: true,
    //useFindAndModify: false
}).then(() => {
    console.log("Connection Open!");
})
.catch(err => {
    console.log("Could not Connect")
    console.log(err)
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



const sessionConfig = {
    secret: 'thisIsASecret',
    resave: false,
    saveUninitialized: true
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())

app.use((req, res, next) => {
    
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error')
    res.locals.currentUser = req.user;
    next();
})//Allows success, error and req.user to be used on every request



app.use('/campgrounds', campgroundsRoutes);
app.use('/campgrounds/:id/review', reviewsRoutes)
app.use('/', userRoutes)

app.use(express.urlencoded({ extended: true}))//Allows you to parse
app.use(methodOverride('_method'))//Allows _method to be used in the action of a form
app.use(express.static(path.join(__dirname, 'public')))//allows for a static folder named 'public'



passport.use(new localStrategy(User.authenticate()))


passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




function wrapAsync(fn){
    return function(req, res, next){
        fn(req, res, next).catch(e => next(e))
    }
}



const localAuth = passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}) //authenticates locally. Can also set it



app.get('/viewcount', (req, res) => {
    if(req.session.count){
        req.session.count += 1
    } else{
        req.session.count = 1;
    }
    console.log(req.session.count)
    res.render('campgrounds/viewCount')
})


app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) err.message = "Something went wrong"
    console.log("You got yourself an error")
    console.log(err)
    res.status(status).render('campgrounds/error', { err });
})

app.listen('3000', () => {
    console.log("listening..")
})