require('colors');
// mongodb user model
const userModels = require('../models/userModel');
const clientModels = require('../models/clientModel');
const orderModels = require('../models/orderModel.js');
require('dotenv').config();
//Tải lên ảnh
const cloudinary = require('../middleware/cloudinary.js');
var express = require('express');
var router = express.Router();
const moment = require('moment');

router.get('/', (req, res) => {
    res.json({
        status: 'Đang phát triển',
        'Tạo khách hàng mới(POST):': `https://api-graduation-project-production.up.railway.app/client/create`,
        'Gọi danh sách khách hàng(GET):': `https://api-graduation-project-production.up.railway.app/client/list`,
        'Gọi chi tiết khách hàng(GET):': `https://api-graduation-project-production.up.railway.app/client/detail/:id`,
        'Cập nhập thông tin khách hàng(PUT):': `https://api-graduation-project-production.up.railway.app/client/update/:id`,
        'Xoá khách hàng(DELETE):': `https://api-graduation-project-production.up.railway.app/client/delete/:id`,
    });
});

// TODO: Gọi danh sách khách hàng
router.get('/list', async (req, res) => {
    try {
        const clients = await clientModels.find({});

        // TODO: Sắp xếp giảm dần
        clients.sort((a, b) => b.createdAt - a.createdAt);

        //  * `creatorID` là dữ liệu từ bảng `userModels`.
        const creatorID = await userModels.find({});

        const creatorMap = {};
        creatorID.forEach((creator) => {
            // * - Vòng lặp `forEach` lặp qua từng id trong danh sách và gán tên của họ cho đối ứng với `creatorID` của họ
            creatorMap[creator._id] = creator.name; // * trong `creatorMap`. Điều này tạo ra một ánh xạ từ `creatorID` đến tên của người sở hữu.
        });

        // * Thay thế creatorID bằng tên người sở hữu
        const updatedClients = clients.map((client) => ({
            ...client.toObject(), // * Sao chép thông tin từ mục khách hàng ban đầu
            creatorID: creatorMap[client.creatorID] || client.creatorID, // * Thay thế creatorID bằng tên người sở hữu tương ứng nếu có, nếu không thì giữ nguyên creatorID.
            createdAt: moment(client.createdAt).format('DD-MM-YYYY HH:mm:ss', true),
            updatedAt: moment(client.updatedAt).format('DD-MM-YYYY HH:mm:ss', true),
        }));

        res.status(200).json(updatedClients);
        console.log(`✅ Gọi danh sách khách hàng thành công`.green.bold);
    } catch (error) {
        console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
        res.status(500).json({
            message: error.message,
        });
    }
});
// TODO: Gọi chi tiết khách hàng ([:id] = id của khách hàng)
router.get('/detail/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await clientModels.findById(id);
        res.status(200).json(client);
        console.log(`✅ Gọi chi tiết người dùng thành công`.green.bold);
    } catch (error) {
        console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
        res.status(500).json({
            message: error.message,
        });
        console.log(`❗  Gọi chi tiết người dùng thất bại`.bgRed.white.strikethrough.bold);
    }
});
// TODO: Tạo khách hàng mới
router.post('/create', async (req, res) => {
    try {
        if (
            req.body.name === '' ||
            req.body.address === '' ||
            // req.body.phone === '' ||
            req.body.email === '' ||
            req.body.gender === '' ||
            req.body.birthday === ''
        ) {
            return res.status(500).json({
                Error: 'Vui lòng không để trống thông tin',
            });
        }
        await userModels
            .findOne({
                phone: req.body.phone,
                email: req.body.email,
            })
            .then((data) => {
                if (data) {
                    return res.status(500).json({
                        Error: 'Email đã tồn tại',
                    });
                } else {
                    const newClient = new clientModels({
                        name: req.body.name,
                        address: req.body.address,
                        phone: req.body.phone,
                        birthday: moment(req.body.birthday, 'DD/MM/YYYY').format('DD/MM/YYYY'),
                        gender: req.body.gender,
                        creatorID: req.body.creatorID,
                    });
                    try {
                        newClient.save();
                        console.log(`✅ Tạo khách hàng thành công`.green.bold);
                        res.json({
                            object: newClient,
                        });
                    } catch (error) {
                        console.log(`❗  ${error}`.bgRed.white.strikethrough.bold);
                        res.status(500).json({
                            Error: error,
                        });
                    }
                }
            });
    } catch (error) {
        console.log(`❗  ${error}`.bgRed.white.strikethrough.bold);
    }
});
// TODO: Cập nhập thông tin khách hàng
router.put('/update/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const data = {
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
            gender: req.body.gender,
            birthday: moment(req.body.birthday, 'DD/MM/YYYY').format('DD/MM/YYYY'),
        };
        await clientModels
            .findByIdAndUpdate(id, data)
            .then((doc) => {
                res.status(200).json({
                    status: 'Cập nhập khách hàng thành công',
                });
                console.log(`✅  Cập nhập khách hàng thành công`.green.bold);
            })
            .catch((err) => {
                console.log(`❗  Lỗi else`.bgRed.white.strikethrough.bold);
            });
    } catch (error) {
        console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
        res.status(500).json({
            message: error.message,
        });
        console.log(`❗  Cập nhập khách hàng thất bại`.bgRed.white.strikethrough.bold);
    }
});
// TODO: ✅ Xoá khách hàng ([:id] = id của khách hàng)
router.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // * Kiểm tra xem khách hàng có nằm trong hóa đơn nào như là khách hàng hay nhân viên không
        const isClientInOrderAsClient = await orderModels.findOne({ client: id });

        // * Nếu khách hàng tồn tại trong hóa đơn, không cho phép xóa
        if (isClientInOrderAsClient) {
            return res.status(400).json({
                status: false,
                message: 'khách hàng này không thể xóa vì đã có trong hóa đơn.',
            });
        }
        // * Xoá người dùng
        const client = await clientModels.findByIdAndDelete(id);
        if (!client) {
            return res.status(404).json({
                message: `Không tìm thấy khách hàng`,
            });
        }
        // * Xoá tệp trên Cloudinary liên quan đến khách hàng
        if (client.cloudinary_id) {
            await cloudinary.uploader.destroy(client.cloudinary_id);
            console.log(`✅ Đã xoá tệp trên Cloudinary của khách hàng: ${client.cloudinary_id}`);
        }
        console.log(`✅ Xoá thành công`);
        res.status(200).json(client);
    } catch (error) {
        console.error(`❗ ${error.message}`);
        res.status(500).json({
            message: error.message,
        });
    }
});
module.exports = router;
