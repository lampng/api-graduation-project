const mongoose = require('mongoose');
const orderSchema = mongoose.Schema({
    account_ID: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "user"
    },
    client_ID: {
        type: mongoose.Schema.Types.ObjectId,
            require: true,
            ref: "client"
    },
    priceTotal: {
        type: Number,
        require: true
    },
    orderStatus: {
        type: Text,
        default: "pending"
    },
    note:{
      type: String,
      require: false  
    },
    deadline: {
        type: Date
    },
    payment:{

    }
}, {
    timestamps: true,
});

const order = mongoose.model('order', orderSchema);

module.exports = order;