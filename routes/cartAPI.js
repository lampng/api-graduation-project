require("colors");
// mongodb user model
const userModels = require("../models/userModel");
const clientModels = require("../models/clientModel");
const cartModels = require("../models/cartModel.js");
const ServiceModels = require("../models/ServiceModel");
require("dotenv").config();
const session = require("express-session");
//Tải lên ảnh
const cloudinary = require("../middleware/cloudinary.js");
const upload = require("../middleware/upload");
const generator = require("generate-password");
const path = require("path");
var bcrypt = require("bcryptjs");
var express = require("express");
var router = express.Router();
var nodemailer = require("nodemailer");
var port = process.env.PORT || 1102;

router.get("/", (req, res) => {
  res.json({
    status: "Đang phát triển",
    "Thêm dịch vụ vào giỏ hàng(POST):": `https://api-graduation-project.vercel.app/cart/addServiceToCart/`,
    instruct: `"userID": "65315dcbc842e097e852587f",\n
    "serviceID": "654b9c35deb4b4ef29563dae"`,
  });
});

// TODO: Thêm dịch vụ vào giỏ hàng
router.post("/addServiceToCart", async (req, res) => {
  const {
    userID,
    serviceID
  } = req.body;
  try {
    // * Tìm giỏ hàng của người dùng
    let cart = await cartModels.findOne({
      userID: userID
    })
    let serviceDetail = await ServiceModels.findById(serviceID)
    // * Kiểm tra xem dịch vụ có tồn tại không
    if (!serviceDetail) {
      return res.status(404).json({
        success: false,
        message: 'Dịch vụ không tồn tại.'
      });
    }
    // * Nếu người dùng chưa có giỏ hàng, tạo mới giỏ hàng
    if (!cart) {
      cart = new cartModels({
        userID,
        items: [],
      });
    }
    // * Kiểm tra xem dịch vụ đã tồn tại trong giỏ hàng chưa
    const existingServiceIndex = cart.items.findIndex(item => item.serviceID.toString() === serviceID);
    if (existingServiceIndex !== -1) {
      return res.status(400).json({
        success: false,
        message: 'Dịch vụ đã tồn tại trong giỏ hàng.'
      });
    }
    // * Thêm dịch vụ vào giỏ hàng
    cart.items.push({
      serviceID: serviceDetail._id,
      name: serviceDetail.name,
      description: serviceDetail.description,
      price: serviceDetail.price,
      image: serviceDetail.image,
    });
    
    let total = 0;
    cart.items.forEach(item => {
      total += item.price;
    });
    cart.subTotal = total;
    cart.finalDeadline = calculateFinalDeadline(cart.items);

    let data = await cart.save();
    res.status(200).json(data)
  } catch (error) {
    console.log(`❗  ${error}`.bgRed.white.strikethrough.bold);
    res.status(400).json({
      type: "Không hợp lệ",
      err: error
    })
  }
})
function calculateFinalDeadline(items) {
  // Hàm tính toán finalDeadline dựa trên deadlines của các dịch vụ trong giỏ hàng
  // Điều chỉnh logic tính toán theo yêu cầu cụ thể của bạn
  let maxDeadline = new Date(); // Giả sử ngày hạn cuối cùng ban đầu là ngày hiện tại

  items.forEach(item => {
      if (item.deadline && item.deadline > maxDeadline) {
          maxDeadline = item.deadline; // Tìm ngày hạn cuối cùng lớn nhất trong danh sách các dịch vụ
      }
  });

  return maxDeadline;
}
module.exports = router;