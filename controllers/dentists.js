const Dentist = require('../models/dentist');
const {cloudinary} = require("../cloudinary")
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
// const { types } = require('joi');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });


module.exports.index = async(req, res) => {
    const dentists = await Dentist.find();
    // res.send(dentists)
    res.render('dentists/index', { dentists });
};

module.exports.renderNewForm =  (req, res) => {
    res.render('dentists/new');
};

module.exports.createDentist = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.dentist.address,
        limit: 1
    }).send()
    const dentist = new Dentist(req.body.dentist);
    dentist.geometry = geoData.body.features[0].geometry;
    dentist.images = req.files.map(f => ({url: f.path, filename: f.filename}));
    dentist.author = req.user._id;
    await dentist.save();
    // console.log(dentist);
    req.flash('success', 'Successfully made a new dentist!');
    res.redirect(`/dentists/${dentist._id}`);
}


module.exports.showDentist = async (req, res, next) => {
    const dentist = await Dentist.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    // console.log(dentist);
    // console.log(dentist.title)
    if (!dentist) {
        req.flash('error', 'Cannot find that dentist!');
        return res.redirect('/dentists');
    }
    res.render('dentists/show', { dentist });
};

module.exports.renderEditForm = async (req, res) => {
    const dentist = await Dentist.findById(req.params.id);
    if (!dentist) {
        req.flash('error', 'Cannot find that dentist!');
        return res.redirect('/dentists');
    }
    res.render('dentists/edit', { dentist });
};

module.exports.updateDentist = async (req, res) => {
    const { id } = req.params;
    const dentist = await Dentist.findByIdAndUpdate(id, { ...req.body.dentist });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    dentist.images.push(...imgs);
    await dentist.save();
    if(req.body.deleteImages){
        for(let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        };
        await dentist.updateOne({$pull: {images:{filename: {$in: req.body.deleteImages}}}});
    }

    req.flash('success', 'Successfully updated a dentist!');
    res.redirect(`/dentists/${dentist._id}`);
};
module.exports.deleteDentist = async (req, res) => {
    const { id } = req.params;
    await Dentist.findByIdAndRemove(id);
    req.flash('success', 'Successfully deleted a dentist!');
    res.redirect(`/dentists`);
};

