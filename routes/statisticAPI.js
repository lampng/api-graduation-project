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
  });
});
router.get("/service", (req,res) => {
  
})
module.exports = router;