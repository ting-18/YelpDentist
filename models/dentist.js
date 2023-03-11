const mongoose = require('mongoose');
const Review = require('./review');
const User = require('./user');

const ImageSchema = new mongoose.Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});


const opts = {toJSON: {virtuals:true}};

const DentistSchema = new mongoose.Schema({
    title: String,
    speciality: String,
    rate: Number,
    address: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    reviews: [{type:mongoose.Schema.Types.ObjectId, ref:'Review'}],
    author: {type:mongoose.Schema.Types.ObjectId, ref:'User'}
}, opts);

DentistSchema.virtual('properties.popUpMarkup').get(function () {
    return `<strong><a href="/dentists/${this._id}">${this.title}</a><strong>
    <p>${this.speciality}</p>`
});

// DentistSchema.pre('findOneAndRemove', async function(data){
//     console.log("Pre");
//     console.log(data)
// })
// DentistSchema.post('findOneAndRemove', async function(data){
//     console.log("Post");
//     console.log(data)
// })
DentistSchema.post('findOneAndRemove', async function(dentist){
    if(dentist.reviews.length){
        const res = await Review.deleteMany({_id:{$in: dentist.reviews}});
    }
})


module.exports = mongoose.model('Dentist', DentistSchema)