const mongoose = require('mongoose');
const serviceSchema = mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    price: {
        type: Number,
        require: true,
    },
    image: {
        type: String,
        require: false,
    },
    // quantityImage: {
    //     type: Number,
    //     default: 30,
    //     require: true,
    // },
    cloudinary_id: {
        type: String,
        require: false,
    },
})
const service = mongoose.model('service', serviceSchema);

module.exports = service;