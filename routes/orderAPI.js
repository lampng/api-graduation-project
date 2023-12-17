require('colors');
// mongodb user model
const userModels = require('../models/userModel');
const clientModels = require('../models/clientModel');
const cartModels = require('../models/cartModel.js');
const orderModels = require('../models/orderModel.js');
const ServiceModels = require('../models/ServiceModel');
const moment = require('moment');

require('dotenv').config();
var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
    res.json({
        status: 'Đang phát triển',
        'Xác nhận đơn hàng(POST):': `https://api-graduation-project-production.up.railway.app/order/comfirmOrder/`,
        'Cập nhập đơn hàng(PUT):': `https://api-graduation-project-production.up.railway.app/order/update/:id`,
        'Xoá đơn hàng(DELETE):': `https://api-graduation-project-production.up.railway.app/order/delete/`,
        'Danh sách đơn hàng(GET):': `https://api-graduation-project-production.up.railway.app/order/list/`,
        'Danh sách đơn hàng của người dùng(GET):': `https://api-graduation-project-production.up.railway.app/order/listOfUser/`,
        'Danh sách công việc của nhân viên(GET):': `https://api-graduation-project-production.up.railway.app/order/listOfStaff/:StaffID`,
    });
});
// TODO: Xác nhận đơn hàng
// * : Tìm giỏ hàng từ params ? tìm dịch vụ : return Giỏ hàng không tồn tại
// * : Tìm dịch vụ ? Xác nhận công việc thành công : không tìm thấy dịch vụ trong giỏ hàng
router.post('/confirmOrder/:id', async (req, res) => {
    const { note, client, started, deadline, location, serviceID } = req.body;
    const userID = req.params.id;

    try {
        if (client === '' || started === '' || deadline === '') {
            return res.status(404).json({
                success: false,
                message: 'Vui lòng điền thông tin',
            });
        }
        let cart = await cartModels.findOne({
            userID: userID,
        });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Giỏ hàng không tồn tại.',
            });
        }

        // Tìm dịch vụ cần xác nhận từ giỏ hàng
        const serviceToConfirm = cart.services.find((service) => service.serviceID.toString() === serviceID);
        console.log(`❕  ${serviceToConfirm}`.cyan.bold);
        if (!serviceToConfirm) {
            return res.status(404).json({
                success: false,
                message: 'Dịch vụ không tồn tại trong giỏ hàng.',
            });
        }
        const staffsOfService = cart.staffs.filter((staff) => staff.serviceID.toString() === serviceID);

        const newOrder = new orderModels({
            userID: userID,
            client: client,
            services: [
                {
                    serviceID: serviceToConfirm.serviceID,
                },
            ],
            staffs: staffsOfService.map((staff) => ({
                staffID: staff.staffID,
            })),
            priceTotal: serviceToConfirm.price,
            started: moment(started, 'HH:mm DD/MM/YYYY').format('HH:mm DD/MM/YYYY'),
            deadline: moment(deadline, 'DD/MM/YYYY').format('DD/MM/YYYY'),
            location: location,
            note: note,
        });

        await newOrder.save();

        // * Xoá dịch vụ và nhân viên có serviceID tương tự từ giỏ hàng
        await cartModels.findOneAndUpdate(
            { userID: userID },
            {
                $pull: {
                    services: { serviceID: serviceToConfirm.serviceID },
                    staffs: { serviceID: serviceToConfirm.serviceID },
                },
            },
        );
        return res.status(200).json({
            success: true,
            message: 'Đã xác nhận đơn hàng và xoá dịch vụ khỏi giỏ hàng.',
        });
    } catch (error) {
        console.log('Error:', error);
        return res.status(500).json({
            success: false,
            message: 'Đã xảy ra lỗi khi xác nhận đơn hàng.',
        });
    }
});
// TODO: ✅ Danh sách đơn hàng
//  ! Hiển thị đơn hàng có trạng thái chưa xác thực lên trên
router.get('/list', async (req, res) => {
    try {
        const orderStatusPriority = {
            'Chưa thực hiện': 1,
            'Đang thực hiện': 2,
            'Hoàn thành': 3,
            'Đã hủy': 4,
        };

        const orders = await orderModels
            .find({
                status: {
                    $in: ['Chưa thực hiện', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy'],
                },
            })
            .populate({
                path: 'client',
                model: 'client',
                select: 'name address phone gender creatorID',
            })
            .populate({
                path: 'services.serviceID',
                model: 'service',
                select: 'name description price image',
            })
            .populate({
                path: 'staffs.staffID',
                model: 'user',
                select: 'name email role job address phone gender citizenIdentityCard birthday avatar status',
            })
            .exec();

        if (orders.length > 0) {
            const ordersWithDays = orders.map((order) => {
                const startedMoment = moment(order.started, 'HH:mm DD/MM/YYYY');
                const deadlineMoment = moment(order.deadline, 'DD/MM/YYYY');
                const daysDifference = deadlineMoment.diff(startedMoment, 'days');

                return {
                    ...order._doc,
                    daysBetween: daysDifference,
                    statusPriority: orderStatusPriority[order.status] || 0, // Gán thứ tự ưu tiên trạng thái
                };
            });

            ordersWithDays.sort((a, b) => {
                return a.statusPriority - b.statusPriority || new Date(b.createdAt) - new Date(a.createdAt);
            });
            console.log(`✅ Gọi danh sách đơn hàng thành công`.green.bold);
            res.status(200).json(ordersWithDays);
        } else {
            console.log(`❗ Không tìm thấy đơn hàng với trạng thái đã chỉ định.`.red.bold);
            res.status(404).json({
                success: false,
                message: '❗ Không tìm thấy đơn hàng với trạng thái đã chỉ định.',
            });
        }
    } catch (error) {
        console.log(`❗ Lỗi khi truy vấn dữ liệu đơn hàng: ${error}`.red.bold);
        res.status(500).json({
            success: false,
            message: '❗ Đã xảy ra lỗi khi truy vấn dữ liệu đơn hàng.',
        });
    }
});

// TODO: ✅ Danh sách đơn hàng của người dùng
router.get('/listOfUser/:id', async (req, res) => {
    const { id } = req.params;
    try {
        if (id == '') {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin.',
            });
        }
        const orderStatusPriority = {
            'Chưa thực hiện': 1,
            'Đang thực hiện': 2,
            'Hoàn thành': 3,
            'Đã hủy': 4,
        };

        await orderModels
            .find({
                userID: id,
                status: {
                    $in: ['Chưa thực hiện', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy'],
                },
            })
            .populate({
                path: 'client',
                model: 'client',
                select: 'name address phone gender creatorID',
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
                if (doc) {
                    const ordersWithDays = doc.map((order) => {
                        const startedMoment = moment(order.started, 'HH:mm DD/MM/YYYY');
                        const deadlineMoment = moment(order.deadline, 'DD/MM/YYYY');

                        const daysDifference = deadlineMoment.diff(startedMoment, 'days');

                        return {
                            ...order._doc,
                            daysBetween: daysDifference,
                            statusPriority: orderStatusPriority[order.status] || 0, // Gán thứ tự ưu tiên trạng thái
                        };
                    });
                    ordersWithDays.sort((a, b) => {
                        return a.statusPriority - b.statusPriority || new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    console.log(`✅ Gọi danh sách đơn hàng của người dùng thành công`.green.bold);
                    res.status(200).json(ordersWithDays);
                }
            })
            .catch((error) => {
                console.log(`❗ Không tìm thấy dữ liệu.`.red.bold);
                res.status(500).json({
                    success: false,
                    message: '❗ Không tìm thấy dữ liệu.',
                });
            });
    } catch (error) {
        console.log('🐼 ~ file: orderAPI.js:153 ~ router.get ~ error:', error);
        res.status(500).json({
            message: error.message,
        });
    }
});
// TODO: ✅ Danh sách công việc của nhân viên
router.get('/listOfStaff', async (req, res) => {
    const { staffID } = req.query;
    try {
        if (staffID == '') {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin.',
            });
        }
        const orderStatusPriority = {
            'Chưa thực hiện': 1,
            'Đang thực hiện': 2,
            'Hoàn thành': 3,
            'Đã hủy': 4,
        };
        await orderModels
            .find({
                'staffs.staffID': staffID,
                status: {
                    $in: ['Chưa thực hiện', 'Đang thực hiện', 'Hoàn thành', 'Đã hủy'],
                },
            })
            .populate({
                path: 'client',
                model: 'client',
                select: 'name address phone gender creatorID',
            })
            .populate({
                path: 'services.serviceID',
                model: 'service',
                select: 'name description price image',
            })
            .populate({
                path: 'staffs.staffID',
                model: 'user',
                select: 'name email role job address phone gender citizenIdentityCard birthday avatar status',
            })
            .then((doc) => {
                if (doc) {
                    const ordersWithDays = doc.map((order) => {
                        const startedMoment = moment(order.started, 'HH:mm DD/MM/YYYY');
                        const deadlineMoment = moment(order.deadline, 'DD/MM/YYYY');
                        const daysDifference = deadlineMoment.diff(startedMoment, 'days');

                        return {
                            ...order._doc,
                            daysBetween: daysDifference,
                            statusPriority: orderStatusPriority[order.status] || 0, // Gán thứ tự ưu tiên trạng thái
                        };
                    });
                    ordersWithDays.sort((a, b) => {
                        return a.statusPriority - b.statusPriority || new Date(b.createdAt) - new Date(a.createdAt);
                    });
                    console.log(`✅ Gọi danh sách đơn hàng của nhân viên thành công`.green.bold);
                    res.status(200).json(ordersWithDays);
                }
            })
            .catch((error) => {
                console.log(`❗ Không tìm thấy dữ liệu.`.red.bold);
                res.status(500).json({
                    success: false,
                    message: '❗ Không tìm thấy dữ liệu.',
                });
            });
    } catch (error) {
        console.log('🐼 ~ file: orderAPI.js:153 ~ router.get ~ error:', error);
        res.status(500).json({
            message: error.message,
        });
    }
});
// TODO: ✅ Xoá đơn hàng
router.delete('/delete/:id', async (req, res) => {
    try {
        if (req.params.id == '') {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin.',
            });
        }
        await orderModels
            .findByIdAndDelete(req.params.id)
            .then((doc) => {
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
            })
            .catch((error) => {
                console.log('🐼 ~ file: orderAPI.js:169 ~ awaitorderModels.findByIdAndDelete ~ error:', error);
            });
    } catch (error) {
        console.log('🐼 ~ file: orderAPI.js:172 ~ router.delete ~ error:', error);
        res.status(500).json({
            message: 'Không tìm thấy đơn hàng',
        });
    }
});
// TODO: ✅ Cập nhập đơn hàng
router.put('/update/:id', async (req, res) => {
    const id = req.params.id;
    try {
        if (id == '') {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin.',
            });
        }
        let order = await orderModels.findById(id);
        const data = {
            status: req.body.status || order.status,
        };
        await orderModels
            .findByIdAndUpdate(id, data)
            .then((doc) => {
                res.status(200).json({
                    status: 'Cập nhập đơn hàng thành công',
                });
            })
            .catch((err) => {
                console.log('🐼 ~ file: orderAPI.js:194 ~ awaitorderModels.findByIdAndUpdate ~ err:', err);
                res.status(500).json({
                    status: 'Cập nhập đơn hàng thất bại',
                });
            });
    } catch (error) {
        console.log('🐼 ~ file: orderAPI.js:130 ~ router.put ~ error:', error);
        res.status(500).json({
            status: error.message,
        });
    }
});

// TODO: Hiển thị công việc của người dùng trong đơn hàng
module.exports = router;
