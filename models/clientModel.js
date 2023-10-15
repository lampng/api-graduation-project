const mongoose = require('mongoose');
const clientSchema = mongoose.Schema({
    name: {
        type: String,
        require: false
    },
    address: {
        type: String,
        require: false
    },
    phone: {
        type: String,
        require: false
    },
    creator:{
        type: String,
        require: false
    },
    datejoin: {
        type: Date,
        default: Date.now()
    },
}, {
    timestamps: true,
});

const client = mongoose.model('client', clientSchema);

module.exports = client;