const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const AppError = require('../AppError.js')
const { validateCampground, isLoggedIn, isAuthor } = require('../middleware');
const passport = require('passport');
const session = require('express-session')
const methodOverride = require('method-override') //To have put or patch requests. Must npm i method-override first
const campgrounds = require('../controllers/campgrounds')
const multer = require('multer');
const {storage} = require('../cloudinary')
const upload = multer({storage})

router.use(express.urlencoded({ extended: true}))//Allows you to parse

router.use(passport.initialize());
router.use(passport.session());

router.use(methodOverride('_method'))//Allows _method to be used in the action of a form


function wrapAsync(fn){
    return function(req, res, next){
        fn(req, res, next).catch(e => next(e))
    }
}





router.route('/')
    .get(campgrounds.index)
    .post( upload.array('image'), validateCampground, wrapAsync(campgrounds.postNew))

router.route('/home')
    .get(campgrounds.home)

router.route('/new')
    .get(isLoggedIn, campgrounds.getNew)


router.get('/:id/delete', isLoggedIn, wrapAsync(campgrounds.getDelete))


router.get('/:id', wrapAsync(campgrounds.campground))



router.get('/:id/edit', isLoggedIn, isAuthor, wrapAsync(campgrounds.getEdit))






router.put('/:id', upload.array('image'), isAuthor, validateCampground,  wrapAsync(campgrounds.postUpdate))


router.delete('/:id', isAuthor, wrapAsync(campgrounds.postDelete))



module.exports = router;