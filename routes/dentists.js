const express = require("express");
const router = express.Router();
const dentists = require('../controllers/dentists');
const catchAsync = require('../utils/catchAsync');
// const ExpressError = require('../utils/ExpressError');
// const Dentist = require('../models/dentist');
// const { dentistSchema } = require('../schemas.js');
const {isLoggedIn, isAuthor, validateDentist} = require('../middleware');

const multer  = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage});


router.route('/')
    .get(catchAsync(dentists.index))
    .post(isLoggedIn, upload.array('image'), validateDentist, catchAsync(dentists.createDentist))
    // .post(upload.array('image'), (req,res)=>{
    //     console.log(req.body, req.file);
    //     res.send("It worked");
    // })

router.get('/new', isLoggedIn, dentists.renderNewForm)

router.route('/:id')
    .get(isLoggedIn, catchAsync(dentists.showDentist))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateDentist, catchAsync(dentists.updateDentist))
    .delete(isLoggedIn, isAuthor, catchAsync(dentists.deleteDentist))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(dentists.renderEditForm))


module.exports = router;