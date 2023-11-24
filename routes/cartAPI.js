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
    instruct: `"userID": "...",\n
    "serviceID": "..."`,
    "Xoá dịch vụ khỏi giỏ hàng(POST):": `https://api-graduation-project.vercel.app/cart/removeServiceFromCart/`,
    instruct: `"userID": "...",\n
    "serviceID": "..."`,
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
    // * Nếu người dùng chưa có giỏ hàng, tạo mới giỏ hàng
    if (!cart) {
      cart = new cartModels({
        userID,
        items: [],
      });
    }
    let serviceDetail = await ServiceModels.findById(serviceID)
    // * Kiểm tra xem dịch vụ có tồn tại không
    if (!serviceDetail) {
      return res.status(404).json({
        success: false,
        message: 'Dịch vụ không tồn tại.'
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
router.delete("/removeServiceFromCart", async (req, res) => {
  const {
    userID,
    serviceID
  } = req.body;
  try {
    // * Tìm giỏ hàng của người dùng
    let cart = await cartModels.findOne({
      userID: userID
    })
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Giỏ hàng không tồn tại.'
      });
    }
    //* Tìm Vị trí của dịch vụ trong mảng items của giỏ hàng
    const serviceIndex = cart.items.findIndex(item => item.serviceID.toString() === serviceID);
    if (serviceIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Dịch vụ không tồn tại trong giỏ hàng.'
      });
    }
    const removedServicePrice = cart.items[serviceIndex].price;
    cart.subTotal -= removedServicePrice;
    //* Xoá dịch vụ khỏi mảng items
    cart.items.splice(serviceIndex, 1);
    // Lưu giỏ hàng mới vào cơ sở dữ liệu
    await cart.save();
    return res.status(200).json({
      success: true,
      message: 'Dịch vụ đã được xoá khỏi giỏ hàng.'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Đã xảy ra lỗi khi xoá dịch vụ khỏi giỏ hàng.'
    });
  }
})
//* 
module.exports = router;