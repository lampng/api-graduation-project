require("colors");
// mongodb user model
const userModels = require("../models/userModel");
const clientModels = require("../models/clientModel");
const ServiceModels = require("../models/ServiceModel");
require("dotenv").config();
const session = require("express-session");
var express = require("express");
const {
  array
} = require("../middleware/upload");
var router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "Đang phát triển",
    "Tạo dịch vụ(POST):": `http://localhost:1102/service/create/`,
  });
});
// TODO: Tạo dịch vụ
router.post("/create/", async (req, res) => {
  try {
    await ServiceModels.findOne({
      name: req.body.name
    }).then((data) => {
      if (data) {
        return res.status(500).json({
          Error: "Dịch vụ này đã tồn tại"
        });
      } else {
        const newService = new ServiceModels({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price
        })
        try {
          newService.save();
          console.log(`✅  Tạo dịch vụ [${req.body.name}] thành công`.green.bold);
          return res.status(200).json({
            Success: `Tạo dịch vụ [${req.body.name}] thành công`
          });
        } catch (error) {
          console.log(`❗  ${error}`.bgRed.white.strikethrough.bold);
          res.status(500).json({
            Error: error,
          });
        }
      }
    })
    // TODO: wait
  } catch (error) {
    return res.status(500).json({
      Error: "Loại dịch vụ này không tồn tại",
    });
  }
})
// TODO: Gọi danh sách dịch vụ
router.get("/list", async (req, res) => {
  try {
    const service = await ServiceModels.find({});
    res.status(200).json(service);
    console.log(`✅ Gọi danh sách dịch vụ thành công`.green.bold);
  } catch (error) {
    console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: error.message,
    });
  }
});
// TODO: Gọi chi tiết dịch vụ ([:id] = id của dịch vụ)
router.get("/detail/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const service = await ServiceModels.findById(id);
    res.status(200).json(service);
    console.log(`✅ Gọi chi tiết dịch vụ thành công`.green.bold);
  } catch (error) {
    console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: error.message,
    });
    console.log(
      `❗  Gọi chi tiết dịch vụ thất bại`.bgRed.white.strikethrough.bold
    );
  }
});
module.exports = router;