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
        "Xác nhận đơn hàng(POST):": `https://api-graduation-project-production.up.railway.app/order/comfirmOrder/`,
        "Cập nhập đơn hàng(PUT):": `https://api-graduation-project-production.up.railway.app/order/update/:id`,
        "Xoá đơn hàng(DELETE):": `https://api-graduation-project-production.up.railway.app/order/comfirmOrder/`,
        "Danh sách đơn hàng(GET):": `https://api-graduation-project-production.up.railway.app/order/list/`,
        "Danh sách đơn hàng của người dùng(GET):": `https://api-graduation-project-production.up.railway.app/order/listOfUser/`,
    });
});
// TODO: Xác nhận đơn hàng
router.post("/comfirmOrder", async (req, res) => {
    const {
        userID,
        note,
        client,
        deadline,
        location
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
            services: cart.services.map(service => ({
                serviceID: service.serviceID,
            })),
            staffs: cart.staffs.map(staff => ({
                staffID: staff.staffID,
            })),
            priceTotal: cart.subTotal,
            deadline: deadline,
            location: location,
            note: note,
        })
        console.log(`❕  ${cart.staffs.map(staff => ({
            staffID: staff.staffID
        }))}`.cyan.bold);
        await newOrder.save().then((doc) => {
            console.log(`✅ Đơn hàng đã được tạo`.green.bold);
        }).catch((error) => {
            console.log("🐼 ~ file: orderAPI.js:76 ~ awaitnewOrder.save ~ error:", error)
        });
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
        const orders = await orderModels.find({})
            .populate({
                path: 'client',
                model: 'client',
                select: 'name ' // Chọn các trường cần hiển thị từ bảng service
            })
            .populate({
                path: 'services.serviceID',
                model: 'service',
                select: 'name description price image ' // Chọn các trường cần hiển thị từ bảng service
            })
            .populate({
                path: 'staffs.staffID',
                model: 'user',
                select: 'name email role job address phone gender citizenIdentityCard birthday avatar status' // Chọn các trường cần hiển thị từ bảng user
            });

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
router.get("/listOfUser/:id", async (req, res) => {
    const {
        userID
    } = req.params
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
            location: req.body.location || order.location,
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