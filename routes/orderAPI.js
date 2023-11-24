require("colors");
// mongodb user model
const userModels = require("../models/userModel");
const clientModels = require("../models/clientModel");
const cartModels = require("../models/cartModel.js");
const orderModels = require("../models/orderModel.js");
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
    });
});

router.post("/comfirmOrder", async (req, res) => {
    const {
        userID,note,client,userID_staff
    } = req.body;
    try {

        let cart = await cartModels.findOne({
            userID: userID
        })
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Giỏ hàng không tồn tại.'
            });
        }
        const newOrder = new orderModels({
            userID: cart.userID, //*Người tạo hoá đơn
            client: client,
            items: cart.items.map(item => ({
                serviceID: item.serviceID,
                name: item.name,
                description: item.description,
                price: item.price,
                image: item.image,
                status: item.status,
            })),
            priceTotal: cart.subTotal,
            note: note,
        })
        await newOrder.save();
        await cartModels.deleteOne({ userID });
        return res.status(200).json({
            success: true,
            message: 'Hoá đơn đã được tạo thành công.'
        });
    } catch (error) {
        console.log("🐼 ~ file: orderAPI.js:64 ~ router.post ~ error:", error)
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo hoá đơn.'
        });
    }
})
module.exports = router;