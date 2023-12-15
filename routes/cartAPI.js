require('colors');
// mongodb model
const userModels = require('../models/userModel');
const clientModels = require('../models/clientModel');
const cartModels = require('../models/cartModel.js');
const ServiceModels = require('../models/ServiceModel');
require('dotenv').config();
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        status: 'Đang phát triển',
        'Thêm dịch vụ vào giỏ hàng(POST):': `https://api-graduation-project-production.up.railway.app/cart/addServiceToCart/`,
        'Thêm dịch vụ vào giỏ hàng(POST):': `https://api-graduation-project-production.up.railway.app/cart/addStaffToCart/`,
        'Xoá dịch vụ khỏi giỏ hàng(delete):': `https://api-graduation-project-production.up.railway.app/cart/removeServiceFromCart/`,
        'Xoá nhân viên thực hiện công việc khỏi giỏ hàng (delete):': `https://api-graduation-project-production.up.railway.app/cart/removeStaffFromCart/`,
        'Gọi danh sách giỏ hàng của người dùng(GET):': `https://api-graduation-project-production.up.railway.app/cart/list/`,
    });
});
// TODO: ✅ Thêm dịch vụ vào giỏ hàng
router.post('/addServiceToCart', async (req, res) => {
    const { userID, serviceID } = req.body;
    try {
        // * Tìm giỏ hàng của người dùng
        let cart = await cartModels.findOne({
            userID: userID,
        });
        // * Nếu người dùng chưa có giỏ hàng, tạo mới giỏ hàng
        if (!cart) {
            cart = new cartModels({
                userID,
                services: [],
            });
        }
        let serviceDetail = await ServiceModels.findById(serviceID);
        // * Kiểm tra xem dịch vụ có tồn tại không
        if (!serviceDetail) {
            return res.status(404).json({
                success: false,
                message: 'Dịch vụ không tồn tại.',
            });
        }

        // * Kiểm tra xem dịch vụ đã tồn tại trong giỏ hàng chưa
        const existingServiceIndex = cart.services.findIndex((item) => item.serviceID.toString() === serviceID);
        if (existingServiceIndex !== -1) {
            return res.status(400).json({
                success: false,
                message: 'Dịch vụ đã tồn tại trong giỏ hàng.',
            });
        }
        // * Thêm dịch vụ vào giỏ hàng
        cart.services.push({
            serviceID: serviceDetail._id,
        });
        await cart
            .save()
            .then((doc) => {
                console.log(`✅ Dịch vụ đã được thêm vào giỏ hàng`.green.bold);
                res.status(200).json(doc);
            })
            .catch((error) => {
                console.log('🐼 ~ file: cartAPI.js:74 ~ awaitcart.save ~ error:', error);
            });
    } catch (error) {
        console.log(`❗  ${error}`.bgRed.white.strikethrough.bold);
        res.status(400).json({
            type: 'Không hợp lệ',
            err: error,
        });
    }
});
// TODO: ✅ Xoá dịch vụ khỏi giỏ hàng
router.delete('/removeServiceFromCart', async (req, res) => {
    const { userID, serviceID } = req.body;
    try {
        // * Tìm giỏ hàng của người dùng
        let cart = await cartModels.findOne({
            userID: userID,
        });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Giỏ hàng không tồn tại.',
            });
        }
        //* Tìm Vị trí của dịch vụ trong mảng services của giỏ hàng
        const serviceIndex = cart.services.findIndex((item) => item.serviceID.toString() === serviceID);
        if (serviceIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Dịch vụ không tồn tại trong giỏ hàng.',
            });
        }
        // //* Xoá dịch vụ khỏi mảng services
        cart.services.splice(serviceIndex, 1);

        // Lưu giỏ hàng mới vào cơ sở dữ liệu
        await cart
            .save()
            .then((doc) => {
                console.log(`❎ Dịch vụ đã được xoá khỏi giỏ hàng`.green.bold);
                res.status(200).json({
                    success: true,
                    message: 'Dịch vụ đã được xoá khỏi giỏ hàng.',
                });
            })
            .catch((error) => {
                console.log('🐼 ~ file: cartAPI.js:120 ~ awaitcart.save ~ error:', error);
            });
    } catch (error) {
        console.log('🐼 ~ file: cartAPI.js:123 ~ router.delete ~ error:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xoá dịch vụ khỏi giỏ hàng.',
        });
    }
});

// ! thêm 1 lần nhiều nhân viên
// TODO: ✅ Thêm nhân viên thực hiện công việc vào giỏ hàng
router.post('/addStaffToCart/:id', async (req, res) => {
    const { serviceID, staffID } = req.body;
    const userID = req.params.id;
    try {
        // * Tìm giỏ hàng của người dùng
        let cart = await cartModels.findOne({
            userID: userID,
        });
        // * Nếu giỏi hàng người dùng chưa có nhân viên, tạo mới bảng nhân viên
        if (!cart) {
            cart = new cartModels({
                userID,
                staffs: [],
            });
        }
        let staffDetail = await userModels.findById(staffID);
        // * Kiểm tra xem nhân viên có tồn tại không
        if (!staffDetail) {
            return res.status(404).json({
                success: false,
                message: 'Nhân viên không tồn tại.',
            });
        }
        const serviceDetail = await ServiceModels.findById(serviceID);
        // * Kiểm tra xem dịch vụ trong giỏ hàng có tồn tại không
        if (!serviceDetail) {
            return res.status(404).json({
                success: false,
                message: 'Dịch vụ không tồn tại trong giỏ hàng.',
            });
        }

        // * Kiểm tra xem nhân viên đã tồn tại trong giỏ hàng chưa
        const existingStaffIndex = cart.staffs.findIndex(
            (staff) => staff.staffID.toString() === staffID && staff.serviceID.toString() === serviceID,
        );
        if (existingStaffIndex !== -1) {
            return res.status(400).json({
                success: false,
                message: 'Nhân viên đã tồn tại trong giỏ hàng.',
            });
        }
        // * Thêm nhân viên thực hiện công việc vào giỏ hàng
        cart.staffs.push({
            staffID: staffDetail._id,
            serviceID: serviceDetail._id,
        });
        await cart
            .save()
            .then((doc) => {
                console.log(`✅ Thêm nhân viên thực hiện thành công`.green.bold);
                res.status(200).json({
                    success: true,
                    message: 'Nhân viên đã được thêm vào giỏ hàng.',
                    data: doc,
                });
            })
            .catch((error) => {
                console.log('🐼 ~ file: cartAPI.js:177 ~ awaitcart.save ~ error:', error);
            });
    } catch (error) {
        console.log(`❗  ${error}`.bgRed.white.strikethrough.bold);
        res.status(400).json({
            type: 'Không hợp lệ',
            err: error,
        });
    }
});

// TODO: ✅ Xoá nhân viên thực hiện công việc khỏi giỏ hàng
router.delete('/removeStaffFromCart/:id', async (req, res) => {
    const { serviceID, staffID } = req.body;
    const userID = req.params.id;
    try {
        // * Tìm giỏ hàng của người dùng
        let cart = await cartModels.findOne({
            userID: userID,
        });
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Giỏ hàng không tồn tại.',
            });
        }
        //* Tìm Vị trí của dịch vụ trong mảng services của giỏ hàng
        const staffIndex = cart.staffs.findIndex(
            (staff) => staff.staffID.toString() === staffID && staff.serviceID.toString() === serviceID,
        );
        if (staffIndex === -1) {
            return res.status(404).json({
                success: false,
                message: 'Nhân viên không tồn tại trong giỏ hàng.',
            });
        }
        //* Xoá nhân viên khỏi mảng staff
        cart.staffs.splice(staffIndex, 1);
        // Lưu giỏ hàng mới vào cơ sở dữ liệu
        await cart
            .save()
            .then((doc) => {
                console.log(`✅ Xoá nhân viên thực hiện thành công`.green.bold);
            })
            .catch((error) => {
                console.log('🐼 ~ file: cartAPI.js:215 ~ awaitcart.save ~ error:', error);
            });
        return res.status(200).json({
            success: true,
            message: 'Nhân viên đã được xoá khỏi giỏ hàng.',
        });
    } catch (error) {
        console.log('🐼 ~ file: cartAPI.js:222 ~ router.delete ~ error:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xoá Nhân viên khỏi giỏ hàng.',
        });
    }
});
// TODO: ✅ Giỏ hàng của người dùng
router.get('/list/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await cartModels
            .findOne({
                userID: id,
            })
            .populate({
                path: 'services.serviceID',
                model: 'service',
                select: 'name description price image ',
            })
            .populate({
                path: 'staffs.staffID',
                model: 'user',
                select: 'name email role job address phone gender citizenIdentityCard birthday avatar status',
            })
            .then((doc) => {
                console.log(`✅ Gọi giỏ hàng của người dùng thành công`.green.bold);
                doc.services.sort((a, b) => {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                });
                return res.status(200).json(doc);
            })
            .catch((error) => {
                console.log('🐼 ~ file: cartAPI.js:257 ~ router.get ~ error: Giỏ hàng không tồn tại.', error);
                return res.status(404).json({
                    success: false,
                    message: '🐼 ~ file: cartAPI.js:257 ~ Giỏ hàng không tồn tại.',
                });
            });
    } catch (error) {
        console.log('🐼 ~ file: cartAPI.js:268 ~ router.get ~ error:', error);
        res.status(500).json({
            message: error.message,
        });
    }
});
module.exports = router;
