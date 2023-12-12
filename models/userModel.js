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

// const usersWithoutSalary = [
//   {
//     name: "Alice Johnson",
//     email: "alice@example.com",
//     password: "alicepass789",
//     role: "Nhân viên",
//     job: "Marketing Manager",
//     address: "789 Oak St, Village",
//     phone: "1112223333",
//     gender: "Nữ",
//     citizenIdentityCard: "IJKL456789",
//     birthday: "15/09/1988",
//     active: "true",
//     status: true
//   },
//   {
//     name: "Robert Brown",
//     email: "robert@example.com",
//     password: "robertpass123",
//     role: "Nhân viên",
//     job: "Product Manager",
//     address: "567 Pine St, Town",
//     phone: "4445556666",
//     gender: "Nam",
//     citizenIdentityCard: "MNOP123456",
//     birthday: "20/03/1982",
//     active: "false",
//     status: true
//   },
//   {
//     name: "Sophie Wilson",
//     email: "sophie@example.com",
//     password: "sophiepass567",
//     role: "Nhân viên",
//     job: "Sales Representative",
//     address: "321 Cedar St, City",
//     phone: "777-888-9999",
//     gender: "Nữ",
//     citizenIdentityCard: "QRST789012",
//     birthday: "10/11/1995",
//     active: "true",
//     status: true
//   },
//   {
//     name: "Michael Davis",
//     email: "michael@example.com",
//     password: "michaelpass456",
//     role: "Nhân viên",
//     job: "Engineer",
//     address: "987 Maple St, Suburb",
//     phone: "2223334444",
//     gender: "Nam",
//     citizenIdentityCard: "UVWX345678",
//     birthday: "25/07/1993",
//     active: "false",
//     status: true
//   },
//   {
//     name: "Emily Thompson",
//     email: "emily@example.com",
//     password: "emilypass789",
//     role: "Nhân viên",
//     job: "HR Manager",
//     address: "456 Walnut St, Town",
//     phone: "5556667777",
//     gender: "Nữ",
//     citizenIdentityCard: "YZAB901234",
//     birthday: "05/12/1980",
//     active: "true",
//     status: true
//   }
// ]
// user.create(usersWithoutSalary)
//   .then(createdUsers => {
//     console.log("Dữ liệu người dùng đã được thêm vào cơ sở dữ liệu:", createdUsers);
//   })
//   .catch(error => {
//     console.error("Lỗi khi thêm dữ liệu người dùng:", error);
//   });
module.exports = user;