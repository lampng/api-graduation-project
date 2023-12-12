const mongoose = require("mongoose");
const monthSchema = mongoose.Schema({
  month: {
    type: String,
    required: true
  },
  salary: {
    type: Number,
    required: true
  },
  bonus: {
    type: Number,
    default: 0
  }
}, {
  _id: false // Không tạo _id tự động cho các mục lương trong tháng
});

const yearSchema = mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  months: [monthSchema] // Một mảng các mục lương trong tháng cho mỗi năm
}, {
  _id: false // Không tạo _id tự động cho các mục lương trong năm
});
const userSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: false,
  },
  role: {
    type: String,
    require: true,
  },
  job: {
    type: String,
    require: false,
  },
  address: {
    type: String,
    require: false,
  },
  phone: {
    type: String,
    require: false,
  },
  gender: {
    type: String,
    require: false
  },
  citizenIdentityCard: {
    type: String,
    require: false
  },
  birthday: {
    type: String,
    require: false,
  },
  avatar: {
    type: String,
    require: false,
  },
  cloudinary_id: {
    type: String,
    require: false,
  },
  active: {
    type: String,
    default: false,
  },
  salary: [yearSchema],
  status: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
});

const user = mongoose.model("user", userSchema);

module.exports = user;