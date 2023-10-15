require("colors");
// mongodb user model
const userModels = require("../models/userModel");
const clientModels = require("../models/clientModel");
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
    "Tạo khách hàng mới(POST):": `https://api-graduation-project.vercel.app/client/create`,
    "Cập nhập thông tin khách hàng(PUT):": `https://api-graduation-project.vercel.app/client/update/:id`,
    "Gọi danh sách khách hàng(GET):": `https://api-graduation-project.vercel.app/client/list`,
    "Xoá khách hàng(DELETE):": `https://api-graduation-project.vercel.app/client/delete/:id`,
  });
});
// TODO: Gọi danh sách khách hàng
router.get("/list", async (req, res) => {
  try {
    const client = await clientModels.find({});
    res.status(200).json(client);
    console.log(`✅ Gọi danh sách khách hàng thành công`.green.bold);
  } catch (error) {
    console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: error.message,
    });
  }
});
// TODO: Tạo khách hàng mới
router.post("/create", async (req, res) => {
  try {
    await userModels
      .findOne({
        phone: req.body.phone,
      })
      .then((data) => {
        if (data) {
          return res.status(500).json({
            Error: "Email đã tồn tại",
          });
        } else {
          const newClient = new clientModels({
            name: req.body.name,
            address: req.body.address,
            phone: req.body.phone,
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
router.put("/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = {
      name: req.body.name,
      address: req.body.address,
      phone: req.body.phone,
    };
    await clientModels
      .findByIdAndUpdate(id, data)
      .then((doc) => {
        res.status(200).json({
          status: "Cập nhập khách hàng thành công",
        });
        console.log(
          `✅  Cập nhập khách hàng thành công`.green.bold
        );
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
// TODO: Xoá khách hàng ([:id] = id của khách hàng)
router.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // Xoá người dùng
    const client = await clientModels.findByIdAndDelete(id);
    if (!client) {
      return res.status(404).json({
        message: `Không tìm thấy người dùng`,
      });
    }
    // Xoá tệp trên Cloudinary liên quan đến người dùng
    if (client.cloudinary_id) {
      await cloudinary.uploader.destroy(client.cloudinary_id);
      console.log(
        `✅ Đã xoá tệp trên Cloudinary của người dùng: ${client.cloudinary_id}`
      );
    }
    console.log(`✅ Xoá thành công`);
    res.status(200).json(client);
  } catch (error) {
    console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: error.message,
    });
  }
});
// TODO: Tìm kiém khách hàng
module.exports = router;
