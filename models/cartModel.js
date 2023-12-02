const mongoose = require('mongoose');
const ItemSchema = mongoose.Schema({
    serviceID: {
        type: mongoose.Schema.Types.ObjectId,
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
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        require: false,
        ref: "user"
    },
    
}, {
    timestamps: true,
});
module.exports = mongoose.model("item", ItemSchema);
 
const cartSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "user"
    },
    client: {
        type: mongoose.Schema.Types.ObjectId,
        require: false,
        ref: "client"
    },
    items: [ItemSchema],
    // * A hòn hiển thị tổng tiền dịch vụ bằng trường subTolal này!
    subTotal: {
        default: 0,
        type: Number,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('cart', cartSchema);