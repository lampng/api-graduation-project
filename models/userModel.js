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
  _id: false
});

const yearSchema = mongoose.Schema({
  year: {
    type: String,
    required: true
  },
  months: [monthSchema]
}, {
  _id: false 
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
  },
  confirmationCode: {
    type: String,
    required: false,
  },
  confirmationCodeExpiration: {
    type: Date,
    required: false,
  },
}, {
  timestamps: true,
});

const user = mongoose.model("user", userSchema);

const usersWithoutSalary = [
  {
    name: "Lành Thanh Tâm",
    email: "thanhtam@gmail.com",
    password: "OqNwCmHlW0dUDL",
    role: "Nhân viên",
    job: "Nhiếp Ảnh Gia",
    address: "65 Hoàng Văn Thụ, Hải Châu, Đà Nẵng",
    phone: "0866030644",
    gender: "Nam",
    citizenIdentityCard: "17011418463768402",
    birthday: "6/30/2000",
    active: "true",
    status: true
  },
  {
    name: "Nguyễn Duy Đạt",
    email: "nguyeduydat@gmail.com",
    password: "KW2cTlvHaf4J",
    role: "Nhân viên",
    job: "Nhiếp Ảnh Gia",
    address: "23 Tiên Sơn 10, Hải Châu, Đà Nẵng",
    phone: "0866055433",
    gender: "Nam",
    citizenIdentityCard: "16794953362191060",
    birthday: "1/27/2000",
    active: "true",
    status: true
  },
  {
    name: "Hoàng Nhã Khiêm",
    email: "khiem@gmail.com",
    password: "FWX3bFitM6xZtZe5AJ2",
    role: "Nhân viên",
    job: "Nhiếp Ảnh Gia",
    address: "16 Phan Bội Châu, Hải Châu",
    phone: "0866080446",
    gender: "Nam",
    citizenIdentityCard: "16726564704546670",
    birthday: "5/2/2000",
    active: "true",
    status: true
  },
  {
    name: "Nguyễn Ngọc Bảo Linh",
    email: "baolinh@gmail.com",
    password: "9AvMqbj",
    role: "Nhân viên",
    job: "Trợ lý Photographer",
    address: "K183/17 Phan Thanh, Thanh Khê, Đà Nẵng",
    phone: "0866114525",
    gender: "Nữ",
    citizenIdentityCard: "17336067739048938",
    birthday: "10/4/2000",
    active: "true",
    status: true
  },
  {
    name: "Bùi Hoàng Anh",
    email: "hoanganh@gmail.com",
    password: "WfO1qPsO5oJmSnwu",
    role: "Nhân viên",
    job: "Trợ lý Photographer",
    address: "64K Nguyễn Sơn, Phường Hòa Cường Nam, Quận Hải Châu, Đà Nẵng",
    phone: "0866117494",
    gender: "Nam",
    citizenIdentityCard: "16796065136663580",
    birthday: "11/12/2000",
    active: "true",
    status: true
  },
  {
    name: "Nguyễn Nhung",
    email: "nhung@gmail.com",
    password: "H7qFyexzs7yRtIify",
    role: "Nhân viên",
    job: "Make-up và Trang Phục",
    address: "K511/29, Trưng Nữ Vương, Phường Hòa Thuận Tây, Quận Hải Châu, Đà Nẵng",
    phone: "0866118442",
    gender: "Nữ",
    citizenIdentityCard: "17418879459718208",
    birthday: "12/15/2000",
    active: "true",
    status: true
  },
  {
    name: "Phan Thị Yến Nhi",
    email: "yenhi@gmail.com",
    password: "jyja8zjl9kv",
    role: "Nhân viên",
    job: "Make-up và Trang Phục",
    address: "207 Trần Tấn Mới, TTTP Quận Hải Châu",
    phone: "0866119770",
    gender: "Nữ",
    citizenIdentityCard: "17513673452766578",
    birthday: "3/31/2000",
    active: "true",
    status: true
  },
  {
    name: "Nguyễn Việt Thắng",
    email: "thang@gmail.com",
    password: "Lfa9tdas",
    role: "Nhân viên",
    job: "Hậu kỳ",
    address: "09, Trường Thi 4, Phường Hòa Thuận Tây, Quận Hải Châu, Đà Nẵng",
    phone: "0866131446",
    gender: "Nam",
    citizenIdentityCard: "17513673452766578",
    birthday: "3/31/2000",
    active: "true",
    status: true
  },
  {
    name: "Nguyễn Tấn Phát",
    email: "tanphat@gmail.com",
    password: "rVxL7S80K",
    role: "Nhân viên",
    job: "Chỉnh sửa ảnh",
    address: "Lê Thanh Nghị, Phường Hòa Cường Bắc, Quận Hải Châu, Đà Nẵng",
    phone: "00866144009",
    gender: "Nam",
    citizenIdentityCard: "17513673452766578",
    birthday: "3/31/2000",
    active: "true",
    status: true
  },
  {
    name: "Nguyễn Vĩnh Trường",
    email: "nesif@gmail.com",
    password: "4TxJJAWvEx",
    role: "Nhân viên",
    job: "Kỹ thuật",
    address: "Đường 2/9, Phường Hòa Cường Bắc, Quận Hải Châu, Đà Nẵng",
    phone: "0866151755",
    gender: "Nam",
    citizenIdentityCard: "17513673452766578",
    birthday: "3/31/2000",
    active: "true",
    status: true
  },
  
]
// user.create(usersWithoutSalary)
//   .then(createdUsers => {
//     console.log("Dữ liệu người dùng đã được thêm vào cơ sở dữ liệu:", createdUsers);
//   })
//   .catch(error => {
//     console.error("Lỗi khi thêm dữ liệu người dùng:", error);
//   });
module.exports = user;