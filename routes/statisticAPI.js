require("colors");
// mongodb user model
const userModels = require("../models/userModel");
const clientModels = require("../models/clientModel");
const cartModels = require("../models/cartModel.js");
const orderModels = require("../models/orderModel.js");
const serviceModels = require("../models/ServiceModel");
const moment = require('moment');

require("dotenv").config();
var express = require("express");
var router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "Đang phát triển",
    "Thống kê dịch vụ sử dụng nhiều nhất (GET)": "https://api-graduation-project-production.up.railway.app/statistic/popular-services",
  });
});
// TODO: Thống kê  dịch vụ sử dụng nhiều nhất
router.get("/popular-services", async (req, res) => {
  try {
    const popularServices = await orderModels.aggregate([{
        $unwind: "$services"
      },
      {
        $group: {
          _id: "$services.serviceID",
          count: {
            $sum: 1
          }
        }
      },
      {
        $sort: {
          count: -1
        }
      },
      {
        $limit: 10
      }
    ]);

    // chúng ta cần tìm trong collection ServiceModels để lấy chi tiết.
    const servicesDetails = await serviceModels.find({
      '_id': {
        $in: popularServices.map(service => service._id)
      }
    }).lean(); // Sử dụng .lean() để trả về plain JavaScript object

    // Ánh xạ qua các dịch vụ và thêm số lượng từ kết quả aggregation
    const servicesWithCount = popularServices.map(service => {
      const serviceDetail = servicesDetails.find(detail => detail._id.equals(service._id));
      return {
        ...serviceDetail,
        count: service.count // Thêm số lượng xuất hiện của dịch vụ
      };
    });
    res.status(200).json(servicesWithCount);
    console.log(`✅ Gọi danh sách dịch vụ xuất hiện nhiều nhất thành công`.green.bold);
  } catch (error) {
    console.log(`❗ ${error.message}`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: error.message,
    });
  }
});
module.exports = router;