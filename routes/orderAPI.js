require("colors");
// mongodb user model
const userModels = require("../models/userModel");
const clientModels = require("../models/clientModel");
const cartModels = require("../models/cartModel.js");
const orderModels = require("../models/orderModel.js");
const ServiceModels = require("../models/ServiceModel");
const moment = require('moment');

require("dotenv").config();
var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
    res.json({
        status: "Đang phát triển",
        "Xác nhận đơn hàng(POST):": `https://api-graduation-project-production.up.railway.app/order/comfirmOrder/`,
        "Cập nhập đơn hàng(PUT):": `https://api-graduation-project-production.up.railway.app/order/update/:id`,
        "Xoá đơn hàng(DELETE):": `https://api-graduation-project-production.up.railway.app/order/delete/`,
        "Danh sách đơn hàng(GET):": `https://api-graduation-project-production.up.railway.app/order/list/`,
        "Danh sách đơn hàng của người dùng(GET):": `https://api-graduation-project-production.up.railway.app/order/listOfUser/`,
    });
});
// TODO: ✅ Xác nhận đơn hàng 
router.post("/comfirmOrder", async (req, res) => {
    const {
        userID,
        note,
        client,
        started,
        deadline,
        location,
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
            started: moment(started, "HH:mm DD/MM/YYYY").format("HH:mm DD/MM/YYYY"),
            deadline: moment(deadline, "DD/MM/YYYY").format("DD/MM/YYYY"),
            location: location,
            note: note,
        })
        await newOrder.save().then((doc) => {
            console.log(`✅ Đơn hàng đã được tạo`.green.bold);
        }).catch((error) => {
            console.log("🐼 ~ file: orderAPI.js:63 ~ awaitnewOrder.save ~ error:", error)
        });
        await cartModels.deleteOne({
            userID
        }).then((doc) => {
            console.log(`✅ Giỏ hàng của người dùng đã được xoá`.green.bold);
            res.status(200).json({
                success: true,
                message: 'Giỏ hàng của người dùng đã được xoá.'
            });
        }).catch((error) => {
            console.log("🐼 ~ file: orderAPI.js:74 ~ router.post ~ error:", error)
        });

    } catch (error) {
        console.log("🐼 ~ file: orderAPI.js:78 ~ router.post ~ error:", error)
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi tạo đơn hàng.'
        });
    }
})
// TODO: ✅ Danh sách đơn hàng 
router.get("/list", async (req, res) => {
    try {
        await orderModels.find({})
            .populate({
                path: 'client',
                model: 'client',
                select: 'name address phone gender creatorID'
            })
            .populate({
                path: 'services.serviceID',
                model: 'service',
                select: 'name description price image '
            })
            .populate({
                path: 'staffs.staffID',
                model: 'user',
                select: 'name email role job address phone gender citizenIdentityCard birthday avatar status', // Chọn các trường cần hiển thị từ bảng user
            }).then((doc) => {
                if (doc) {

                    const ordersWithDays = doc.map(order => {
                        const startedMoment = moment(order.started, "DD/MM/YYYY");
                        const deadlineMoment = moment(order.deadline, "DD/MM/YYYY");

                        // * Tính toán số ngày giữa hai ngày
                        const daysDifference = deadlineMoment.diff(startedMoment, 'days');

                        // * Thêm vào đối tượng đơn hàng
                        return {
                            ...order._doc, // * Sử dụng _doc để lấy dữ liệu thô của Mongoose document
                            daysBetween: daysDifference
                        };
                    });
                    ordersWithDays.sort((a, b) => {
                        return new Date(a.createdAt) - new Date(b.createdAt);
                      });
                    console.log(`✅ Gọi danh sách đơn hàng thành công`.green.bold);
                    res.status(200).json(ordersWithDays);
                } else {
                    console.log(`❗ Không tìm thấy người dùng.`.red.bold);
                    res.status(500).json({
                        success: true,
                        message: '❗ Không tìm thấy người dùng.',
                    });
                }
            }).catch((error) => {
                console.log("🐼 ~ file: orderAPI.js:150 ~ router.get ~ error:", error)
            });
    } catch (error) {
        console.log(`❗ Không tìm thấy dữ liệu.`.red.bold);
        res.status(500).json({
            success: false,
            message: '❗ Không tìm thấy dữ liệu.',
        });
    }
});
// TODO: ✅ Danh sách đơn hàng của người dùng 
router.get("/listOfUser/:id", async (req, res) => {
    const {
        id
    } = req.params
    try {
        await orderModels.find({
                "userID": id
            })
            .populate({
                path: 'client',
                model: 'client',
                select: 'name address phone gender creatorID' // Chọn các trường cần hiển thị từ bảng service
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
            }).then((doc) => {
                if (doc) {
                    const ordersWithDays = doc.map(order => {
                        const startedMoment = moment(order.started, "DD/MM/YYYY");
                        const deadlineMoment = moment(order.deadline, "DD/MM/YYYY");

                        // Tính toán số ngày giữa hai ngày
                        const daysDifference = deadlineMoment.diff(startedMoment, 'days');

                        // Thêm vào đối tượng đơn hàng
                        return {
                            ...order._doc, // Sử dụng _doc để lấy dữ liệu thô của Mongoose document
                            daysBetween: daysDifference
                        };
                    });
                    daysDifference.sort((a, b) => {
                        return new Date(b.createdAt) - new Date(a.createdAt);
                      });
                    console.log(`✅ Gọi danh sách đơn hàng của người dùng thành công`.green.bold);
                    res.status(200).json(ordersWithDays);
                }
            }).catch((error) => {
                console.log(`❗ Không tìm thấy dữ liệu.`.red.bold);
                res.status(500).json({
                    success: false,
                    message: '❗ Không tìm thấy dữ liệu.',
                });
            });
    } catch (error) {
        console.log("🐼 ~ file: orderAPI.js:153 ~ router.get ~ error:", error)
        res.status(500).json({
            message: error.message,
        });
    }
});
// TODO: ✅ Xoá đơn hàng 
router.delete("/delete/:id", async (req, res) => {
    try {
        await orderModels.findByIdAndDelete(req.params.id).then((doc) => {
            if (doc) {
                console.log(`❎ Xoá đơn hàng thành công`.green.bold);
                res.status(200).json({
                    success: true,
                    message: '❎ Xoá đơn hàng thành công.',
                });
            } else {
                res.status(200).json({
                    success: true,
                    message: '❗ Không tìm thấy đơn hàng.',
                });
            }
        }).catch((error) => {
            console.log("🐼 ~ file: orderAPI.js:169 ~ awaitorderModels.findByIdAndDelete ~ error:", error)
        });
    } catch (error) {
        console.log("🐼 ~ file: orderAPI.js:172 ~ router.delete ~ error:", error)
        res.status(500).json({
            message: "Không tìm thấy đơn hàng",
        });
    }
});
// TODO: ✅ Cập nhập đơn hàng
router.put("/update/:id", async (req, res) => {
    const id = req.params.id
    try {
        let order = await orderModels.findById(id);
        const data = {
            note: req.body.note || order.note,
            status: req.body.status || order.status,
            started: moment(req.body.started, "DD/MM/YYYY").format("DD/MM/YYYY") || order.started,
            deadline: moment(req.body.deadline, "DD/MM/YYYY").format("DD/MM/YYYY") || order.deadline,
            location: req.body.location || order.location,
        }
        await orderModels.findByIdAndUpdate(id, data).then((doc) => {
            res.status(200).json({
                status: "Cập nhập đơn hàng thành công",
            });
        }).catch((err) => {
            console.log("🐼 ~ file: orderAPI.js:194 ~ awaitorderModels.findByIdAndUpdate ~ err:", err)
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
// TODO: Hiển thị công việc của người dùng trong đơn hàng


module.exports = router;