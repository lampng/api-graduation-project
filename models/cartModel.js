const mongoose = require('mongoose');
const serviceSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        require: false,
        ref: "user"
    },
    serviceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service",
    },
}, { 
    timestamps: true,
    _id: false
});
module.exports = mongoose.model("itemService", serviceSchema);
 
const staffSchema = mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        require: false,
        ref: "user"
    },
    staffID : {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "user"
    },
    serviceID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "service",
    },
}, {
    timestamps: true,
    _id: false
});
module.exports = mongoose.model("staff", staffSchema);

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
    services: [serviceSchema],
    staffs: [staffSchema],
    // * A hòn hiển thị tổng tiền dịch vụ bằng trường subTolal này!
}, {
    timestamps: true,
});

module.exports = mongoose.model('cart', cartSchema);