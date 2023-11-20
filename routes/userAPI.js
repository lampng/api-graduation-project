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
    status: "API ON",
    // "Đăng ký(POST):": `http://localhost:${port}/user/register`,
    // "Đăng nhập(POST):": `http://localhost:${port}/user/login`,
    // "Đăng xuất(GET):": `http://localhost:${port}/user/logout`,
    // "Cập nhập người dùng(PUT):": `http://localhost:${port}/user/update/:id`,
    // "Xoá người dùng(DELETE):": `http://localhost:${port}/user/delete/:id`,
    // "Gọi danh sách người dùng(GET):": `http://localhost:${port}/user/list`,
    // "Gọi chi tiết người dùng(GET):": `http://localhost:${port}/user/detail/:id`,
    "Đăng ký(POST):": `https://api-graduation-project.vercel.app/user/register`,
    "Đăng nhập(POST):": `https://api-graduation-project.vercel.app/user/login`,
    "Đăng xuất(GET):": `https://api-graduation-project.vercel.app/user/logout/:id`, //* lưu ý: sử dụng id của session khi đăng nhập(khi đăng nhập trên điện thoại sẽ tự lưu vào local tạm thời của ứng dụng.)
    "Cập nhập người dùng(PUT):": `https://api-graduation-project.vercel.app/user/update/:id`,
    "Đổi mật khẩu(PUT):": `https://api-graduation-project.vercel.app/user/change-password/:id`,
    "Xoá người dùng(DELETE):": `https://api-graduation-project.vercel.app/user/delete/:id`,
    "Gọi danh sách người dùng(GET):": `https://api-graduation-project.vercel.app/user/list`,
    "Gọi chi tiết người dùng(GET):": `https://api-graduation-project.vercel.app/user/detail/:id`,
  });
});
// TODO: Đăng ký người dùng
router.post("/register", async (req, res) => {
  try {
    // Kiểm tra đã có ai đã sử dụng email chưa
    const emailCheck = await userModels.findOne({
      email: req.body.email,
    });

    if (emailCheck) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    //* Tạo mật khẩu random
    const password = generator.generate({
      length: 10,
      numbers: true,
    });
    console.log(`Mật khẩu của bạn: ${password}`);

    //* Mã hoá mật khẩu
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //* Tạo người dùng mới
    const newUser = new userModels({
      name: req.body.name,
      email: req.body.email,
      citizenIdentityCard: req.body.citizenIdentityCard,
      password: hashedPassword,
      role: req.body.role,
      job: req.body.job,
    });
    try {
      await newUser.save();
      //* Gửi mật khẩu về email đã được đăng ký
      var nodemailer = require("nodemailer");

      var transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSEMAIL,
        },
      });

      var mailOptions = {
        from: process.env.EMAIL,
        to: req.body.email,
        subject: "Xác minh tài khoản ứng dụng quản lý",
        // html:'Mật khẩu của bạn là: ' + '<p><b>'+password+'</b></p>',
        html: `
        <!DOCTYPE html>
<html ⚡4email data-css-strict>
  <head>
    <meta charset="utf-8" />
    <style amp4email-boilerplate>
      body {
        visibility: hidden;
      }
    </style>
    <script async src="https://cdn.ampproject.org/v0.js"></script>
    <style amp-custom>
      .es-desk-hidden {
        display: none;
        float: left;
        overflow: hidden;
        width: 0;
        max-height: 0;
        line-height: 0;
      }
      body {
        width: 100%;
        font-family: Imprima, Arial, sans-serif;
      }
      table {
        border-collapse: collapse;
        border-spacing: 0px;
      }
      table td,
      body,
      .es-wrapper {
        padding: 0;
        margin: 0;
      }
      .es-content,
      .es-header,
      .es-footer {
        table-layout: fixed;
        width: 100%;
      }
      p,
      hr {
        margin: 0;
      }
      h1,
      h2,
      h3,
      h4,
      h5 {
        margin: 0;
        line-height: 120%;
        font-family: Imprima, Arial, sans-serif;
      }
      .es-left {
        float: left;
      }
      .es-right {
        float: right;
      }
      .es-p5 {
        padding: 5px;
      }
      .es-p5t {
        padding-top: 5px;
      }
      .es-p5b {
        padding-bottom: 5px;
      }
      .es-p5l {
        padding-left: 5px;
      }
      .es-p5r {
        padding-right: 5px;
      }
      .es-p10 {
        padding: 10px;
      }
      .es-p10t {
        padding-top: 10px;
      }
      .es-p10b {
        padding-bottom: 10px;
      }
      .es-p10l {
        padding-left: 10px;
      }
      .es-p10r {
        padding-right: 10px;
      }
      .es-p15 {
        padding: 15px;
      }
      .es-p15t {
        padding-top: 15px;
      }
      .es-p15b {
        padding-bottom: 15px;
      }
      .es-p15l {
        padding-left: 15px;
      }
      .es-p15r {
        padding-right: 15px;
      }
      .es-p20 {
        padding: 20px;
      }
      .es-p20t {
        padding-top: 20px;
      }
      .es-p20b {
        padding-bottom: 20px;
      }
      .es-p20l {
        padding-left: 20px;
      }
      .es-p20r {
        padding-right: 20px;
      }
      .es-p25 {
        padding: 25px;
      }
      .es-p25t {
        padding-top: 25px;
      }
      .es-p25b {
        padding-bottom: 25px;
      }
      .es-p25l {
        padding-left: 25px;
      }
      .es-p25r {
        padding-right: 25px;
      }
      .es-p30 {
        padding: 30px;
      }
      .es-p30t {
        padding-top: 30px;
      }
      .es-p30b {
        padding-bottom: 30px;
      }
      .es-p30l {
        padding-left: 30px;
      }
      .es-p30r {
        padding-right: 30px;
      }
      .es-p35 {
        padding: 35px;
      }
      .es-p35t {
        padding-top: 35px;
      }
      .es-p35b {
        padding-bottom: 35px;
      }
      .es-p35l {
        padding-left: 35px;
      }
      .es-p35r {
        padding-right: 35px;
      }
      .es-p40 {
        padding: 40px;
      }
      .es-p40t {
        padding-top: 40px;
      }
      .es-p40b {
        padding-bottom: 40px;
      }
      .es-p40l {
        padding-left: 40px;
      }
      .es-p40r {
        padding-right: 40px;
      }
      .es-menu td {
        border: 0;
      }
      s {
        text-decoration: line-through;
      }
      p,
      ul li,
      ol li {
        font-family: Imprima, Arial, sans-serif;
        line-height: 150%;
      }
      ul li,
      ol li {
        margin-bottom: 15px;
        margin-left: 0;
      }
      a {
        text-decoration: underline;
      }
      .es-menu td a {
        text-decoration: none;
        display: block;
        font-family: Imprima, Arial, sans-serif;
      }
      .es-wrapper {
        width: 100%;
        height: 100%;
      }
      .es-wrapper-color,
      .es-wrapper {
        background-color: #ffffff;
      }
      .es-header {
        background-color: transparent;
      }
      .es-header-body {
        background-color: #efefef;
      }
      .es-header-body p,
      .es-header-body ul li,
      .es-header-body ol li {
        color: #2d3142;
        font-size: 14px;
      }
      .es-header-body a {
        color: #2d3142;
        font-size: 14px;
      }
      .es-content-body {
        background-color: #efefef;
      }
      .es-content-body p,
      .es-content-body ul li,
      .es-content-body ol li {
        color: #2d3142;
        font-size: 18px;
      }
      .es-content-body a {
        color: #2d3142;
        font-size: 18px;
      }
      .es-footer {
        background-color: transparent;
      }
      .es-footer-body {
        background-color: #ffffff;
      }
      .es-footer-body p,
      .es-footer-body ul li,
      .es-footer-body ol li {
        color: #2d3142;
        font-size: 14px;
      }
      .es-footer-body a {
        color: #2d3142;
        font-size: 14px;
      }
      .es-infoblock,
      .es-infoblock p,
      .es-infoblock ul li,
      .es-infoblock ol li {
        line-height: 120%;
        font-size: 12px;
        color: #cccccc;
      }
      .es-infoblock a {
        font-size: 12px;
        color: #cccccc;
      }
      h1 {
        font-size: 48px;
        font-style: normal;
        font-weight: bold;
        color: #2d3142;
      }
      h2 {
        font-size: 36px;
        font-style: normal;
        font-weight: bold;
        color: #2d3142;
      }
      h3 {
        font-size: 28px;
        font-style: normal;
        font-weight: bold;
        color: #2d3142;
      }
      .es-header-body h1 a,
      .es-content-body h1 a,
      .es-footer-body h1 a {
        font-size: 48px;
      }
      .es-header-body h2 a,
      .es-content-body h2 a,
      .es-footer-body h2 a {
        font-size: 36px;
      }
      .es-header-body h3 a,
      .es-content-body h3 a,
      .es-footer-body h3 a {
        font-size: 28px;
      }
      a.es-button,
      button.es-button {
        padding: 15px 20px 15px 20px;
        display: inline-block;
        background: #4114f7;
        border-radius: 30px;
        font-size: 22px;
        font-family: Imprima, Arial, sans-serif;
        font-weight: bold;
        font-style: normal;
        line-height: 120%;
        color: #ffffff;
        text-decoration: none;
        width: auto;
        text-align: center;
      }
      .es-button-border {
        border-style: solid solid solid solid;
        border-color: #2cb543 #2cb543 #2cb543 #2cb543;
        background: #4114f7;
        border-width: 0px 0px 0px 0px;
        display: inline-block;
        border-radius: 30px;
        width: auto;
      }
      body {
        font-family: arial, "helvetica neue", helvetica, sans-serif;
      }
      .es-p-default {
        padding-top: 20px;
        padding-right: 40px;
        padding-bottom: 0px;
        padding-left: 40px;
      }
      .es-p-all-default {
        padding: 0px;
      }
      .es-menu amp-img,
      .es-button amp-img {
        vertical-align: middle;
      }
      @media only screen and (max-width: 600px) {
        p,
        ul li,
        ol li,
        a {
          line-height: 150%;
        }
        h1,
        h2,
        h3,
        h1 a,
        h2 a,
        h3 a {
          line-height: 120%;
        }
        h1 {
          font-size: 30px;
          text-align: left;
        }
        h2 {
          font-size: 24px;
          text-align: left;
        }
        h3 {
          font-size: 20px;
          text-align: left;
        }
        .es-header-body h1 a,
        .es-content-body h1 a,
        .es-footer-body h1 a {
          font-size: 30px;
          text-align: left;
        }
        .es-header-body h2 a,
        .es-content-body h2 a,
        .es-footer-body h2 a {
          font-size: 24px;
          text-align: left;
        }
        .es-header-body h3 a,
        .es-content-body h3 a,
        .es-footer-body h3 a {
          font-size: 20px;
          text-align: left;
        }
        .es-menu td a {
          font-size: 14px;
        }
        .es-header-body p,
        .es-header-body ul li,
        .es-header-body ol li,
        .es-header-body a {
          font-size: 14px;
        }
        .es-content-body p,
        .es-content-body ul li,
        .es-content-body ol li,
        .es-content-body a {
          font-size: 14px;
        }
        .es-footer-body p,
        .es-footer-body ul li,
        .es-footer-body ol li,
        .es-footer-body a {
          font-size: 14px;
        }
        .es-infoblock p,
        .es-infoblock ul li,
        .es-infoblock ol li,
        .es-infoblock a {
          font-size: 12px;
        }
        *[class="gmail-fix"] {
          display: none;
        }
        .es-m-txt-c,
        .es-m-txt-c h1,
        .es-m-txt-c h2,
        .es-m-txt-c h3 {
          text-align: center;
        }
        .es-m-txt-r,
        .es-m-txt-r h1,
        .es-m-txt-r h2,
        .es-m-txt-r h3 {
          text-align: right;
        }
        .es-m-txt-l,
        .es-m-txt-l h1,
        .es-m-txt-l h2,
        .es-m-txt-l h3 {
          text-align: left;
        }
        .es-m-txt-r amp-img {
          float: right;
        }
        .es-m-txt-c amp-img {
          margin: 0 auto;
        }
        .es-m-txt-l amp-img {
          float: left;
        }
        .es-button-border {
          display: block;
        }
        a.es-button,
        button.es-button {
          font-size: 18px;
          display: block;
          border-right-width: 0px;
          border-left-width: 0px;
          border-top-width: 15px;
          border-bottom-width: 15px;
        }
        .es-adaptive table,
        .es-left,
        .es-right {
          width: 100%;
        }
        .es-content table,
        .es-header table,
        .es-footer table,
        .es-content,
        .es-footer,
        .es-header {
          width: 100%;
          max-width: 600px;
        }
        .es-adapt-td {
          display: block;
          width: 100%;
        }
        .adapt-img {
          width: 100%;
          height: auto;
        }
        td.es-m-p0 {
          padding: 0px;
        }
        td.es-m-p0r {
          padding-right: 0px;
        }
        td.es-m-p0l {
          padding-left: 0px;
        }
        td.es-m-p0t {
          padding-top: 0px;
        }
        td.es-m-p0b {
          padding-bottom: 0;
        }
        td.es-m-p20b {
          padding-bottom: 20px;
        }
        .es-mobile-hidden,
        .es-hidden {
          display: none;
        }
        tr.es-desk-hidden,
        td.es-desk-hidden,
        table.es-desk-hidden {
          width: auto;
          overflow: visible;
          float: none;
          max-height: inherit;
          line-height: inherit;
        }
        tr.es-desk-hidden {
          display: table-row;
        }
        table.es-desk-hidden {
          display: table;
        }
        td.es-desk-menu-hidden {
          display: table-cell;
        }
        .es-menu td {
          width: 1%;
        }
        table.es-table-not-adapt,
        .esd-block-html table {
          width: auto;
        }
        table.es-social {
          display: inline-block;
        }
        table.es-social td {
          display: inline-block;
        }
        .es-desk-hidden {
          display: table-row;
          width: auto;
          overflow: visible;
          max-height: inherit;
        }
      }
    </style>
  </head>
  <body>
    <div dir="ltr" class="es-wrapper-color" lang="vi">
      <!--[if gte mso 9
        ]><v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
          <v:fill type="tile" color="#ffffff"></v:fill> </v:background
      ><![endif]-->
      <table class="es-wrapper" width="100%" cellspacing="0" cellpadding="0">
        <tr>
          <td valign="top">
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-footer"
              align="center"
            >
              <tr>
                <td align="center">
                  <table
                    bgcolor="#bcb8b1"
                    class="es-footer-body"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="600"
                  >
                    <tr>
                      <td class="es-p20t es-p20b es-p40r es-p40l" align="left">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="520" align="center" valign="top">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                              >
                                <tr>
                                  <td align="center" style="display: none"></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-content"
              align="center"
            >
              <tr>
                <td align="center">
                  <table
                    bgcolor="#efefef"
                    class="es-content-body"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="600"
                    style="border-radius: 20px 20px 0 0"
                  >
                    <tr>
                      <td class="es-p40t es-p40r es-p40l" align="left">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="520" align="center" valign="top">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                              >
                                <tr>
                                  <td
                                    align="left"
                                    class="es-m-txt-c"
                                    style="font-size: 0px"
                                  >
                                    <a
                                      target="_blank"
                                      href="https://viewstripo.email"
                                      ><amp-img
                                        src="https://fbfajkv.stripocdn.email/content/guids/CABINET_ee77850a5a9f3068d9355050e69c76d26d58c3ea2927fa145f0d7a894e624758/images/group_4076323.png"
                                        alt="Confirm email"
                                        style="
                                          display: block;
                                          border-radius: 100px;
                                        "
                                        width="100"
                                        title="Confirm email"
                                        height="100"
                                      ></amp-img
                                    ></a>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td class="es-p20t es-p40r es-p40l" align="left">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="520" align="center" valign="top">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                                bgcolor="#fafafa"
                                style="
                                  background-color: #fafafa;
                                  border-radius: 10px;
                                  border-collapse: separate;
                                "
                              >
                                <tr>
                                  <td align="left" class="es-p20">
                                    <h3>Xin chào, ${req.body.email}</h3>
                                    <p><br /></p>
                                    <p>
                                      Bạn nhận được thông báo này vì bạn đã được
                                      đăng ký tài khoản.
                                    </p>
                                    <p>
                                      Mật khẩu của bạn ở phía dưới. Bước này
                                      tăng cường bảo mật cho doanh nghiệp của
                                      bạn cho rằng bạn sở hữu email
                                      này.
                                    </p>
                                    
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-content"
              align="center"
            >
              <tr>
                <td align="center">
                  <table
                    bgcolor="#efefef"
                    class="es-content-body"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="600"
                  >
                    <tr>
                      <td class="es-p30t es-p40b es-p40r es-p40l" align="left">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="520" align="center" valign="top">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                              >
                                <tr>
                                  <td align="center">
                                    <span
                                      class="msohide es-button-border"
                                      style="
                                        display: block;
                                        background: #0E55A7;
                                      "
                                      ><a
                                        href
                                        class="es-button msohide"
                                        target="_blank"
                                        style="
                                          padding-left: 5px;
                                          padding-right: 5px;
                                          display: block;
                                          background: #0E55A7;
                                          mso-border-alt: 10px solid #0E55A7;
                                        "
                                        >${password}</a
                                      ></span
                                    >
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                    <tr>
                      <td class="es-p40r es-p40l" align="left">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="520" align="center" valign="top">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                              >
                                <tr>
                                  <td align="left">
                                  <p>
                                      Sau khi tải ứng dụng và đăng nhập, bạn vui lòng đổi lại mật khẩu và cập nhập thông tin cá nhân của mình
                                    </p>
                                    <p>Cảm ơn.
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-content"
              align="center"
            >
              <tr>
                <td align="center">
                  <table
                    bgcolor="#efefef"
                    class="es-content-body"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="600"
                    style="border-radius: 0 0 20px 20px"
                  >
                    <tr>
                      <td
                        class="es-p20t es-p20b es-p40r es-p40l esdev-adapt-off"
                        align="left"
                      >
                        <table
                          width="520"
                          cellpadding="0"
                          cellspacing="0"
                          class="esdev-mso-table"
                        >
                          <tr>
                            <td class="esdev-mso-td" valign="top">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                align="left"
                                class="es-left"
                              >
                                <tr>
                                  <td width="47" align="center" valign="top">
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                    >
                                      <tr>
                                        <td
                                          align="center"
                                          class="es-m-txt-l"
                                          style="font-size: 0px"
                                        >
                                          <a
                                            target="_blank"
                                            href="https://viewstripo.email"
                                            ><amp-img
                                              src="https://fbfajkv.stripocdn.email/content/guids/CABINET_ee77850a5a9f3068d9355050e69c76d26d58c3ea2927fa145f0d7a894e624758/images/group_4076325.png"
                                              alt="Demo"
                                              style="display: block"
                                              width="47"
                                              title="Demo"
                                              height="47"
                                            ></amp-img
                                          ></a>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                            <td width="20"></td>
                            <td class="esdev-mso-td" valign="top">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                class="es-right"
                                align="right"
                              >
                                <tr>
                                  <td width="453" align="center" valign="top">
                                    <table
                                      cellpadding="0"
                                      cellspacing="0"
                                      width="100%"
                                    >
                                      <tr>
                                        <td
                                          align="center"
                                          style="display: none"
                                        ></td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-footer"
              align="center"
            >
              <tr>
                <td align="center">
                  <table
                    bgcolor="#bcb8b1"
                    class="es-footer-body"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="600"
                  >
                    <tr>
                      <td class="es-p40t es-p30b es-p20r es-p20l" align="left">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="560" align="left">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                              >
                                <tr>
                                  <td align="center" style="display: none"></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
            <table
              cellpadding="0"
              cellspacing="0"
              class="es-footer"
              align="center"
            >
              <tr>
                <td align="center">
                  <table
                    bgcolor="#ffffff"
                    class="es-footer-body"
                    align="center"
                    cellpadding="0"
                    cellspacing="0"
                    width="600"
                  >
                    <tr>
                      <td class="es-p20" align="left">
                        <table cellpadding="0" cellspacing="0" width="100%">
                          <tr>
                            <td width="560" align="left">
                              <table
                                cellpadding="0"
                                cellspacing="0"
                                width="100%"
                              >
                                <tr>
                                  <td align="center" style="display: none"></td>
                                </tr>
                              </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </div>
  </body>
</html>

        `,
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log("Email sent: " + info.response);
        }
      });
      res.json({
        message: "Đăng ký thành công",
      });
      console.log(`✅  Đăng ký thành công`.green.bold);
    } catch (error) {
      res.json({
        message: "Đăng ký không thành công",
      });
      console.log(`❗  Đăng ký không thành công`.bgRed.white.bold);
    }
    // =============================================
  } catch (error) {}
});
// TODO: Đăng nhập
router.post("/login", async (req, res) => {
  try {
    //* Lấy email và password từ phía người dùng khi nhập
    const {
      email,
      password
    } = req.body;
    const check = await userModels.findOne({
      email,
    });

    // * Kiểm tra mật khẩu có chính xác hay không
    const isMatch = await bcrypt.compare(password, check.password);
    await userModels
      .findOne({
        email,
      })
      .then((data) => {
        if (data) {
          if (check.password != null) {
            if (isMatch) {
              var role = check.role;
              console.log(`✅  Đăng nhập thành công`.green.bold);
              req.session.email = check.email;
              req.session._id = check._id;
              req.session.loggedin = true;
              req.session.role = role;

              const {
                _id,
                loggedin
              } = req.session;
              const getName = check.name;
              const getEmail = check.email;
              const getRole = check.role;
              const getAddress = check.address;
              const getPhone = check.phone;
              const getBirthday = check.birthday;
              const getAvatar = check.avatar;
              const getcloudinary_id = check.cloudinary_id;
              const getActive = check.active;
              res.json({
                session_id: req.session.id,
                _id: _id,
                loggedin: loggedin,
                name: getName,
                email: getEmail,
                role: getRole,
                address: getAddress,
                phone: getPhone,
                birthday: getBirthday,
                avatar: getAvatar,
                cloudinary_id: getcloudinary_id,
                active: getActive,
              });
            } else {
              res.send("Sai mật khẩu");
              console.log(`Sai mật khẩu`.bgRed.white.strikethrough.bold);
            }
          }
        }
      });
  } catch (err) {
    res.status(500).send("Sai email");
    console.log("Sai email".bgRed.white.strikethrough.bold);
  }
});
// TODO: Gọi danh sách người dùng
router.get("/list", async (req, res) => {
  try {
    const user = await userModels.find({});
    res.status(200).json(user);
    console.log(`✅ Get list user Success`.green.bold);
    // // //* Tạo người dùng mới
    // const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash("123456", salt);
    // const newUser = new userModels({
    //   name: "Nguyễn Thanh Hoàng",
    //   email: "nguyenthanhhon@gmail.com",
    //   citizenIdentityCard: "123456789",
    //   password: hashedPassword,
    //   role: "Nhân viên",
    //   job: "Photographer",
    // });
    // await newUser.save();
  } catch (error) {
    console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: error.message,
    });
  }
});
// TODO: Gọi chi tiết người dùng ([:id] = id của người dùng)
router.get("/detail/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const user = await userModels.findById(id);
    res.status(200).json(user);
    console.log(`✅ Gọi chi tiết người dùng thành công`.green.bold);
  } catch (error) {
    console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: error.message,
    });
    console.log(
      `❗  Gọi chi tiết người dùng thất bại`.bgRed.white.strikethrough.bold
    );
  }
});
//  TODO: Chỉnh sửa thông tin người dùng khi chưa kích hoạt tài khoản
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const {
      id
    } = req.params;
    let user = await userModels.findById(id);
    //* Kiểm tra trong form có hình ảnh không, nếu không sẽ nhảy xuống else
    if (req.file != null) {
      // * Kiểm tra tài khoản đã có sẵn avatar chưa, nếu có rồi sẽ xoá và cập nhập hình mới
      if (user.cloudinary_id != null) {
        await cloudinary.uploader.destroy(user.cloudinary_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "api-graduation-project/users",
      });
      const data = {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        address: req.body.address || user.address,
        phone: req.body.phone || user.phone,
        birthday: req.body.birthday || user.birthday,
        avatar: result.secure_url || user.avatar,
        cloudinary_id: result.public_id || user.cloudinary_id,
        active: true,
      };
      await userModels
        .findByIdAndUpdate(id, data, {
          new: true,
        })
        .then((doc) => {
          res.json({
            status: "Cập nhập người (hình ảnh) dùng thành công",
          });
          console.log(
            `✅  Cập nhập người (hình ảnh) dùng thành công`.green.bold
          );
        })
        .catch((err) => {
          console.log(`Lỗi catch: `.bgRed, err);
        });
      // * Cập nhập không có hình ảnh
    } else {
      const data = {
        name: req.body.name || user.name,
        email: req.body.email || user.email,
        address: req.body.address || user.address,
        phone: req.body.phone || user.phone,
        birthday: req.body.birthday || user.birthday,
        active: true,
      };
      await userModels
        .findByIdAndUpdate(id, data)
        .then((doc) => {
          res.json({
            status: "Cập nhập người dùng (không hình ảnh)  thành công",
          });
          console.log(
            `✅  Cập nhập người (không hình ảnh) dùng thành công`.green.bold
          );
        })
        .catch((err) => {
          console.log(`❗  Lỗi else`.bgRed.white.strikethrough.bold);
        });
    }
  } catch (error) {
    console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: error.message,
    });
    console.log(`❗  Cập nhập thất bại`.bgRed.white.strikethrough.bold);
  }
});
//  TODO: Đổi mật khẩu
// * Nhập mật khẩu cũ để xác thực, nếu đúng sẽ cho đặt mật khẩu mới
router.put("/change-password/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;
    let check = await userModels.findById(id);
    // const check = await userModels.findOne({
    //   id,
    // });
    //* Mã hoá mật khẩu
    const oldPass = req.body.oldpassword;
    const newPass = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPass, salt);
    // * Kiểm tra mật khẩu có chính xác hay không
    const isMatch = await bcrypt.compare(oldPass, check.password);

    if (isMatch) {
      const data = {
        password: hashedPassword,
      };
      await userModels.findByIdAndUpdate(id, data).then((doc) => {
        res.status(200).json({
          status: "Đổi mật khẩu thành công",
        });
        console.log(`✅  Đổi mật khẩu thành công`.green.bold);
      });
    } else {
      res.json({
        status: "Mật khẩu cũ của bạn không đúng!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "Mật khẩu cũ của bạn không đúng, vui lòng nhập lại",
    });
    console.log(`❗  ${error}`.bgRed.white.strikethrough.bold);
  }
});
// TODO: Xoá người dùng ([:id] = id của người dùng)
router.delete("/delete/:id", async (req, res) => {
  try {
    const {
      id
    } = req.params;
    // Xoá người dùng
    const user = await userModels.findByIdAndDelete(id);
    if (!user) {
      return res.status(404).json({
        message: `Không tìm thấy người dùng`,
      });
    }
    // Xoá tệp trên Cloudinary liên quan đến người dùng
    if (user.cloudinary_id) {
      await cloudinary.uploader.destroy(user.cloudinary_id);
      console.log(
        `✅ Đã xoá tệp trên Cloudinary của người dùng: ${user.cloudinary_id}`
      );
    }
    console.log(`✅ Xoá thành công`);
    res.status(200).json(user);
  } catch (error) {
    console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: error.message,
    });
  }
});
// TODO: Đăng xuất
// * lưu ý: sử dụng id của session khi đăng nhập(khi đăng nhập trên điện thoại sẽ tự lưu vào local tạm thời của ứng dụng.)
router.get("/logout/:id", (req, res) => {
  const id = req.params.id;
  req.sessionStore.destroy(id);
  res.send("Đăng xuất thành công");
  console.log(`✅  Đăng xuất thành công`.green.bold);
});
// TODO: Quên mật khẩu
router.get("/forgot-password", async (req, res) => {
  try {
    const email = req.body.email;
    // * Kiểm tra email
    await userModels.findOne({
      email
    }).then((data) => {
      if (data) {
        // * Gọi hàm random số để làm mã xác thực
        const VerifyNumber = generateRandomNumberString(6);
        // Lấy thời gian hiện tại
        const timenow = new Date();
        // Tính thời gian hết hạn 5 phút sau
        const expirationTime = new Date(timenow.getTime() + 5 * 60 * 1000); // 5 phút
        // Lưu trữ VerifyNumber và expirationTime tạm thời
        temporaryVerifyNumber = {
          code: VerifyNumber,
          expiresAt: expirationTime,
        };
        console.log(`✅ ${VerifyNumber}`.green.bold);

        res.status(200).json({
          Status: "Mã xác thực đã được gửi đến email của bạn, mã xác thực sẽ hết hạn sau 5 phút",
        });
      } else {
        console.log(`❌ Sai mail`.red.bold);
        res.status(500).json({
          status: "Sai mail",
        });
      }
    });
  } catch (error) {}
});
// TODO: Verify Email
router.post("/verify", async (req, res) => {
  const {
    inputVerifyNumber
  } = req.body;

  if (temporaryVerifyNumber) {
    const now = new Date();
    if (inputVerifyNumber === temporaryVerifyNumber.code && now < temporaryVerifyNumber.expiresAt) {
      // Mã xác thực hợp lệ
      res.status(200).json({
        Status: true,
      });
    } else {
      // Mã xác thực đã hết hạn hoặc không hợp lệ
      res.status(400).json({
        Status: false,
      });
    }
  } else {
    // temporaryVerifyNumber không tồn tại
    res.status(400).json({
      Status: false,
    });
  }
});
//  TODO: Đổi mật khẩu
// * đặt mật khẩu mới
router.put("/reset-password", async (req, res) => {
  try {

  } catch (error) {
    res.status(500).json(error);
    console.log(`❗  ${error}`.bgRed.white.strikethrough.bold);
  }
});

// * random number
function generateRandomNumberString(length) {
  const numbers = "0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * numbers.length);
    result += numbers.charAt(randomIndex);
  }

  return result;
}
module.exports = router;