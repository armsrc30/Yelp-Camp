const Campground = require('../models/campground');
const {cloudinary} = require("../cloudinary");
const mapboxToken = process.env.MAPBOX_TOKEN;
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geoCoder = mbxGeocoding({accessToken: mapboxToken});
const AppError = require('../AppError')
console.log("Token ====>")



module.exports.index = async (req, res) => {

    
    const camps = await Campground.find({});


    
    
    res.render('campgrounds/index', { camps });
}


module.exports.home = (req, res) => {
    res.render('campgrounds/home')
}

module.exports.getNew = (req, res) => {
    res.render('campgrounds/new')
    
}

module.exports.getDelete = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    res.render('campgrounds/delete', { camp })
}

module.exports.campground = async (req, res, next) => {
    const { id } = req.params;
    const camp = await Campground.findById(id).populate({
        path: 'review',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if(!camp){
        req.flash('error', 'Could Not Find Campground');
        return res.render('/')
    }
    if(!camp){
        throw AppError('Not Found', 404)
    }
    
    res.render('campgrounds/show', { camp });
}

module.exports.getEdit = async (req, res) => {
    const { id } = req.params;
    const camp = await Campground.findById(id);
    if(!camp){
        req.flash('error', 'Could Not Find Campground');
        return res.render('/')
    }
    
    res.render('campgrounds/edit', { camp })
}

module.exports.postNew = async (req, res, next) => {
    const content = new Campground(req.body);
    
    const geoData = await geoCoder.forwardGeocode({
        query: req.body.location,
        limit: 1
    }).send()
   
 
    
    
    content.images = req.files.map(f => ({url: f.path, filename: f.filename}))//Iterates over img array and saves those two values into new campground
    content.author = req.user._id
    content.geometry = geoData.body.features[0].geometry;
    console.log("GeoData ===>")
    console.log(geoData);
    console.log("Next ===>");
    console.log(geoData.body.features[0].geometry);
    console.log(content);
    
    try{
        
        await content.save()
        req.flash('success', 'Successfully Made New Campground')
        res.redirect('/campgrounds');
    }catch(error){
        const { message } = error;
        return next(new AppError(message, 404));
    }
}

module.exports.postUpdate = async (req, res) => {



    const { id } = req.params;
    const newContent = req.body;
    const updated = await Campground.findByIdAndUpdate(id, newContent);
    const imgs = req.files.map(f => ({url: f.path, filename: f.filename}));
    updated.images.push(...imgs)//passes each object from push seperately
    await updated.save(); 

    //This pulls only the images in our campground that are ALSO in the deleteImages array of our schema
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename); //built into cloudinary. Deletes images from cloudinary based on filename
        }
        await updated.updateOne({$pull: {images: {filename: {$in: req.body.deleteImages}}}})
    }
    req.flash('success', `Successfuly Updated Camp`)
    res.redirect(`/campgrounds/${updated.id}`)


}

module.exports.postDelete = async (req, res) => {
    const { id } = req.params;
    const updated = await Campground.findByIdAndDelete(id);
    res.redirect('/campgrounds')

}