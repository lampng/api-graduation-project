require("colors");
// mongodb user model
const userModels = require("../models/userModel");
const clientModels = require("../models/clientModel");
const cartModels = require("../models/cartModel.js");
const orderModels = require("../models/orderModel.js");
const ServiceModels = require("../models/ServiceModel");
require("dotenv").config();
var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.json({
        status: "Đang phát triển",
        "Xác nhận đơn hàng(POST):": `https://api-graduation-project.vercel.app/order/comfirmOrder/`,
        "Cập nhập đơn hàng(PUT):": `https://api-graduation-project.vercel.app/order/update/:id`,
        "Xoá đơn hàng(DELETE):": `https://api-graduation-project.vercel.app/order/comfirmOrder/`,
        "Danh sách đơn hàng(GET):": `https://api-graduation-project.vercel.app/order/list/`,
        "Danh sách đơn hàng của người dùng(GET):": `https://api-graduation-project.vercel.app/order/listOfUser/`,
    });
});
// TODO: Xác nhận đơn hàng
router.post("/comfirmOrder", async (req, res) => {
    const {
        userID,
        note,
        client,
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
            deadline: req.body.deadline,
            location: req.body.location,
            note: note,
        })
        await newOrder.save();
        await cartModels.deleteOne({
            userID
        });
        return res.status(200).json({
            success: true,
            message: 'đơn hàng đã được tạo thành công.'
        });
    } catch (error) {
        console.log("🐼 ~ file: orderAPI.js:60 ~ router.post ~ error:", error)
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo đơn hàng.'
        });
    }
})
// TODO: Danh sách đơn hàng
router.get("/list", async (req, res) => {
    try {
        const orders = await orderModels.find({});
        res.status(200).json(orders);
        console.log(`✅ Gọi danh sách đơn hàng thành công`.green.bold);
    } catch (error) {
        console.log("🐼 ~ file: orderAPI.js:72 ~ router.get ~ error:", error)
        res.status(500).json({
            message: error.message,
        });
    }
});
// TODO: Danh sách đơn hàng của người dùng
router.get("/listOfUser", async (req, res) => {
    const {
        userID
    } = req.body
    try {
        const orders = await orderModels.find({
            userID
        });
        res.status(200).json(orders);
        console.log(`✅ Gọi danh sách đơn hàng của người dùng thành công`.green.bold);
    } catch (error) {
        console.log("🐼 ~ file: orderAPI.js:85 ~ router.get ~ error:", error)
        res.status(500).json({
            message: error.message,
        });
    }
});
// TODO: Xoá đơn hàng
router.delete("/delete/:id", async (req, res) => {
    try {
        const orders = await orderModels.findByIdAndDelete(req.params.id);

        console.log(`✅ Xoá đơn hàng thành công`);
        res.status(200).json(orders);
    } catch (error) {
        console.log("🐼 ~ file: orderAPI.js:98 ~ router.delete ~ error:", error)
        res.status(500).json({
            message: "Không tìm thấy đơn hàng",
        });
    }
});
// TODO: Cập nhập đơn hàng
router.put("/update/:id", async (req, res) => {
    const id = req.params.id
    console.log("🐼 ~ file: orderAPI.js:114 ~ router.update ~ req.params.id:", id)
    try {
        let order = await orderModels.findById(id);
        const data = {
            note: req.body.note || order.note,
            status: req.body.status || order.status,
            deadline: req.body.deadline || order.deadline,
        }
        await orderModels.findByIdAndUpdate(id, data).then((doc) => {
            res.status(200).json({
                status: "Cập nhập đơn hàng thành công",
            });
        }).catch((err) => {
            console.log("🐼 ~ file: orderAPI.js:124 ~ awaitorderModels.findByIdAndUpdate ~ err:", err)
            res.status(500).json({
                status: "Cập nhập đơn hàng thất bại",
            });
        })
    } catch (error) {
        console.log("🐼 ~ file: orderAPI.js:130 ~ router.put ~ error:", error)
        res.status(500).json({
            status: error.message,
        });
    }
})
module.exports = router;