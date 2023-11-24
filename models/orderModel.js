const mongoose = require('mongoose');
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
    items: [{
        serviceID: {
            type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "service",
        },
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
        status: {
            type: String,
            require: false,
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
    deadline: {
        type: Date,
        require: true
    },
    location: {
        type: String,
        require: true
    }
}, {
    timestamps: true,
});

const order = mongoose.model('order', orderSchema);

module.exports = order;