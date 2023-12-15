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
    creatorID:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        require: true
    },
    birthday:{
        type: String,
        require: false
    },
    gender:{
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