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
    // name: {
    //     type: String,
    //     require: true,
    // },
    // description: {
    //     type: String,
    //     require: true,
    // },
    // price: {
    //     type: Number,
    //     require: true,
    // },
    // image: {
    //     type: String,
    //     require: false,
    // }
}, {
    timestamps: true,
});
module.exports = mongoose.model("item", serviceSchema);
 
// TODO: Bảng nhân viên thực hiện công việc
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
    // name: {
    //     type: String,
    //     require: true
    // },
    // job: {
    //     type: String,
    //     require: true
    // },
    // phone: {
    //     type: String,
    //     require: true
    // },
    // avatar: {
    //     type: String,
    //     require: false,
    // },
    // citizenIdentityCard: {
    //     type: String,
    //     require: false
    // },
    // status: {
    //     type: Boolean,
    //     default: true
    // },
    // address: {
    //     type: String,
    //     require: false,
    // },
    // gender: {
    //     type: String,
    //     require: false
    // },
    // active: {
    //     type: String,
    //     default: false,
    //   },
}, {
    timestamps: true,
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
    subTotal: {
        default: 0,
        type: Number,
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('cart', cartSchema);