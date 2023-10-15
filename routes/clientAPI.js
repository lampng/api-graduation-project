require("colors");
// mongodb user model
const userModels = require("../models/userModel");
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
      status: "Đăng phát triển",
    });
  });

module.exports = router;