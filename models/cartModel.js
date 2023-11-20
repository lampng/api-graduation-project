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
    deadline: {
        type: Date, // Ngày hạn
        required: false, // Tuỳ chọn, tùy thuộc vào yêu cầu của bạn
    },
    status: {
        type: String, // Trạng thái
        enum: ['Chưa thực hiện', 'Đang thực hiện', 'Hoàn thành', 'Không hoàn thành'],
        default: 'Chưa thực hiện', // Trạng thái mặc định khi thêm vào giỏ hàng
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
    items: [ItemSchema],
    subTotal: {
        default: 0,
        type: Number,
    },
    finalDeadline: {
        type: Date, // Ngày hạn cuối cùng
        required: false, // Tuỳ chọn, tùy thuộc vào yêu cầu của bạn
    },
    status: {
        type: String, // Trạng thái
        enum: ['Chưa thực hiện', 'Đang thực hiện', 'Hoàn thành', 'Không hoàn thành'],
        default: 'Chưa thực hiện', // Trạng thái mặc định khi thêm vào giỏ hàng
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('cart', cartSchema);