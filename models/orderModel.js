const mongoose = require('mongoose');
const moment = require('moment');

const orderSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "user"
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "client"
    },
    services: [{
        serviceID: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "service",
        },
    }],
    staffs: [{
        staffID: {
            type: mongoose.Schema.Types.ObjectId,   
            require: true,
            ref: "user",
        },
    }],
    priceTotal: {
        type: Number,
        require: true
    },
    note: {
        type: String,
        require: false
    },
    started: {
        type: String,
        require: true,
    },
    deadline: {
        type: String,
        require: true,
    },
    location: {
        type: String,
        require: true
    },
    status: {
        type: String, // Trạng thái
        default: 'Chưa thực hiện', // Trạng thái mặc định
    },
}, {
    timestamps: true,
});

const order = mongoose.model('order', orderSchema);

module.exports = order;