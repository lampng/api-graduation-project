require('colors');
// mongodb user model
const userModels = require('../models/userModel');
const orderModels = require('../models/orderModel.js');
require('dotenv').config();
const session = require('express-session');
//Tải lên ảnh
const cloudinary = require('../middleware/cloudinary.js');
const upload = require('../middleware/upload');
const generator = require('generate-password');
const path = require('path');
var bcrypt = require('bcryptjs');
var express = require('express');
var router = express.Router();
const moment = require('moment');

router.get('/', (req, res) => {
    res.json({
        status: 'API ON',
        'Đăng ký(POST):': `https://api-graduation-project-production.up.railway.app/user/register`,
        'Đăng nhập(POST):': `https://api-graduation-project-production.up.railway.app/user/login`,
        'Đăng xuất(GET):': `https://api-graduation-project-production.up.railway.app/user/logout/:id`, //* lưu ý: sử dụng id của session khi đăng nhập(khi đăng nhập trên điện thoại sẽ tự lưu vào local tạm thời của ứng dụng.)
        'Cập nhập người dùng(PUT):': `https://api-graduation-project-production.up.railway.app/user/update/:id`,
        'Đổi mật khẩu(PUT):': `https://api-graduation-project-production.up.railway.app/user/change-password/:id`,
        'Xoá người dùng(DELETE):': `https://api-graduation-project-production.up.railway.app/user/delete/:id`,
        'Gọi danh sách người dùng(GET):': `https://api-graduation-project-production.up.railway.app/user/list`,
        'Gọi chi tiết người dùng(GET):': `https://api-graduation-project-production.up.railway.app/user/detail/:id`,
        'Thêm lương người dùng(POST):': `https://api-graduation-project-production.up.railway.app/user/salary/:id`,
        'Gọi danh sách lương người dùng(GET):': `https://api-graduation-project-production.up.railway.app/user/salary/:id`,
        'Cập nhập lương người dùng(PUT):': `https://api-graduation-project-production.up.railway.app/user/salary/:id`,
        'Xoá lương người dùng(DELETE):': `https://api-graduation-project-production.up.railway.app/user/salary/:id`,
        'Quên mật khẩu(GET):': `https://api-graduation-project-production.up.railway.app/user/forgot-password/`,
        'Xác nhận mã được gửi về mail(POST):': `https://api-graduation-project-production.up.railway.app/user/verify-confirmation-code/`,
        'Đặt lại mật khẩu mới(PUT):': `https://api-graduation-project-production.up.railway.app/user/reset-password/`,
    });
});
// TODO: Đăng ký người dùng
router.post('/register', async (req, res) => {
    try {
        // Báo lỗi khi nhập thiếu hoặc không nhập thông tin
        if (
            req.body.name == '' ||
            req.body.email == '' ||
            req.body.citizenIdentityCard == '' ||
            req.body.role == '' ||
            req.body.job == ''
        ) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin.',
            });
        }
        // * Kiểm tra đã có ai đã sử dụng email chưa
        const emailCheck = await userModels.findOne({
            email: req.body.email,
        });

        if (emailCheck) {
            return res.status(400).json({
                message: 'Email đã tồn tại',
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
            status: true,
        });
        try {
            await newUser.save();
            //* Gửi mật khẩu về email đã được đăng ký
            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
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
                subject: 'Xác minh tài khoản ứng dụng quản lý',
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

                                    <p>Sau khi tải ứng dụng và đăng nhập, bạn vui lòng đổi lại mật khẩu và cập nhập thông tin cá nhân của mình
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
                    console.log('Email sent');
                }
            });
            res.json({
                message: 'Đăng ký thành công',
            });
            console.log(`✅  Đăng ký thành công`.green.bold);
        } catch (error) {
            res.json({
                message: 'Đăng ký không thành công',
            });
            console.log(`❗  Đăng ký không thành công`.bgRed.white.bold);
        }
        // =============================================
    } catch (error) {
        console.log(error);
        res.json({
            message: 'Đăng ký lỗi',
        });
    }
});
// TODO: Đăng nhập
router.post('/login', async (req, res) => {
    try {
        if (req.body.email === '' || req.body.password === '') {
            return res.status(400).json({
                message: 'Vui lòng nhập đủ thông tin',
            });
        }
        const { email, password } = req.body;
        const check = await userModels.findOne({ email });

        if (!check || !check.password) {
            res.send('Sai email hoặc mật khẩu');
            console.log(`Sai email hoặc mật khẩu`.bgRed.white.strikethrough.bold);
            return;
        }
        const isMatch = await bcrypt.compare(password, check.password);

        if (isMatch) {
            const { _id, role, name, address, phone, birthday, avatar, cloudinary_id, active } = check;
            console.log(`✅  Đăng nhập thành công`.green.bold);

            req.session.email = check.email;
            req.session._id = check._id;
            req.session.loggedin = true;
            req.session.role = role;

            const { loggedin } = req.session;

            res.json({
                session_id: req.session.id,
                _id,
                loggedin,
                name,
                email,
                role,
                address,
                phone,
                birthday,
                avatar,
                cloudinary_id,
                active,
            });
        } else {
            res.send('Sai mật khẩu');
            console.log(`Sai mật khẩu`.bgRed.white.strikethrough.bold);
        }
    } catch (err) {
        res.status(500).send('Lỗi server');
        console.log('Lỗi server'.bgRed.white.strikethrough.bold);
    }
});
// TODO: Gọi danh sách người dùng
router.get('/list', async (req, res) => {
    try {
        await userModels
            .find({})
            .then((doc) => {
                // TODO: Sắp xếp giảm dần
                doc.sort((a, b) => b.createdAt - a.createdAt);

                const formatDate = doc.map((user) => ({
                    ...user.toObject(),
                    createdAt: moment(user.createdAt).format('DD-MM-YYYY HH:mm:ss', true),
                    updatedAt: moment(user.updatedAt).format('DD-MM-YYYY HH:mm:ss', true),
                }));

                console.log(`✅ Gọi danh sách người dùng thành công`.green.bold);
                res.status(200).json(formatDate);
            })
            .catch((error) => {
                console.log('🐼 ~ file: userAPI.js:1149 ~ awaituserModels.find ~ error:', error);
            });
    } catch (error) {
        console.log('🐼 ~ file: userAPI.js:1152 ~ router.get ~ error:', error);
        res.status(500).json({
            message: error.message,
        });
    }
});
// TODO: Gọi chi tiết người dùng ([:id] c)
router.get('/detail/:id', async (req, res) => {
    try {
        const { id } = req.params;
        if (id == '') {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng điền đầy đủ thông tin.',
            });
        }
        const doc = await userModels.findById(id);
        console.log(`✅ Gọi chi tiết người dùng thành công`.green.bold);
        res.status(200).json(doc);
    } catch (error) {
        console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
        res.status(500).json({ message: error.message });
        console.log(`❗  Gọi chi tiết người dùng thất bại`.bgRed.white.strikethrough.bold);
    }
});
//  TODO: Chỉnh sửa thông tin người dùng khi chưa kích hoạt tài khoản
router.put('/update/:id', upload.single('image'), async (req, res) => {
    try {
        const { id } = req.params;
        const user = await userModels.findById(id);
        if (
            req.body.name === '' ||
            req.body.email === '' ||
            req.body.role === '' ||
            req.body.job === '' ||
            req.body.gender == '' ||
            req.body.birthday == ''
        ) {
            return res.status(400).json({
                message: 'Vui lòng nhập đủ thông tin',
            });
        }
        if (req.file != null) {
            // * Kiểm tra và cập nhật thông tin người dùng kèm hình ảnh
            if (user.cloudinary_id != null) {
                await cloudinary.uploader.destroy(user.cloudinary_id);
            }
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'api-graduation-project/users',
            });

            const data = {
                ...req.body,
                avatar: result.secure_url || user.avatar,
                cloudinary_id: result.public_id || user.cloudinary_id,
                active: true,
            };

            await userModels.findByIdAndUpdate(id, data, { new: true });
            res.json({ status: 'Cập nhập người (hình ảnh) dùng thành công' });
            console.log(`✅  Cập nhập người (hình ảnh) dùng thành công`.green.bold);
        } else {
            // * Cập nhật thông tin người dùng khi không có hình ảnh
            const data = { ...req.body, active: true };

            await userModels.findByIdAndUpdate(id, data);
            res.json({ status: 'Cập nhập người dùng (không hình ảnh)  thành công' });
            console.log(`✅  Cập nhập người (không hình ảnh) dùng thành công`.green.bold);
        }
    } catch (error) {
        console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
        res.status(500).json({ message: error.message });
        console.log(`❗  Cập nhập thất bại`.bgRed.white.strikethrough.bold);
    }
});
//  TODO: Đổi mật khẩu
router.put('/change-password/:id', async (req, res) => {
    // * Nhập mật khẩu cũ để xác thực, nếu đúng sẽ cho đặt mật khẩu mới
    try {
        const { id } = req.params;
        if (id == '') {
            return res.status(400).json({
                message: 'Vui lòng nhập đủ thông tin',
            });
        }
        const check = await userModels.findById(id);

        // * Mã hoá mật khẩu mới
        const oldPass = req.body.oldpassword;
        const newPass = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPass, salt);

        // * Kiểm tra mật khẩu cũ có chính xác hay không
        const isMatch = await bcrypt.compare(oldPass, check.password);

        if (isMatch) {
            // * Nếu mật khẩu cũ chính xác, cập nhật mật khẩu mới vào cơ sở dữ liệu
            const data = { password: hashedPassword };
            await userModels.findByIdAndUpdate(id, data);

            res.status(200).json({
                status: true,
                message: 'Đổi mật khẩu thành công',
            });
            console.log(`✅  Đổi mật khẩu thành công`.green.bold);
        } else {
            // * Nếu mật khẩu cũ không chính xác, thông báo lỗi
            res.json({
                status: false,
                message: 'Mật khẩu cũ của bạn không đúng, vui lòng nhập lại',
            });
        }
    } catch (error) {
        // * Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra trong quá trình xử lý
        res.status(500).json({
            status: false,
            message: 'Đã xảy ra lỗi khi thay đổi mật khẩu',
        });
        console.log(`❗  ${error.message}`.bgRed.white.strikethrough.bold);
    }
});
// TODO: ✅ Xoá người dùng ([:id] = id của người dùng)
router.delete('/delete/:id', async (req, res) => {
    try {
        if (req.params.id == '') {
            return res.status(400).json({
                message: 'Vui lòng nhập đủ thông tin',
            });
        }
        // * Kiểm tra xem người dùng có nằm trong hóa đơn nào không
        const isUserInOrder = await orderModels.findOne({
            'staffs.staffID': req.params.id,
        });
        // * Nếu người dùng tồn tại trong hóa đơn, không cho phép xóa
        if (isUserInOrder) {
            return res.status(400).json({
                message: 'Người dùng này không thể xóa vì đã có trong hóa đơn.',
            });
        }
        // * Nếu người dùng không nằm trong hóa đơn, tiếp tục quá trình xóa
        const user = await userModels.findByIdAndDelete(req.params.id);
        // * Xoá tệp trên Cloudinary liên quan đến người dùng
        if (user.cloudinary_id) {
            await cloudinary.uploader.destroy(user.cloudinary_id);
            console.log(`✅ Đã xoá tệp trên Cloudinary của người dùng: ${user.cloudinary_id}`);
        }
        console.log(`✅ Xoá thành công`);
        res.status(200).json({
            message: 'người dùng đã được xóa thành công',
            name: user.name,
        });
    } catch (error) {
        console.error(`❗ Không tìm thấy người dùng`);
        res.status(500).json({
            message: 'Không tìm thấy người dùng hoặc có lỗi xảy ra',
        });
    }
});
// TODO: Đăng xuất
// * lưu ý: sử dụng id của session khi đăng nhập(khi đăng nhập trên điện thoại sẽ tự lưu vào local tạm thời của ứng dụng.)
router.get('/logout/:id', (req, res) => {
    const id = req.params.id;
    req.sessionStore.destroy(id);
    console.log(`✅  Đăng xuất thành công`.green.bold);
    return res.status(200).json({
        success: true,
        message: 'Đăng xuất thành công',
    });
});
// TODO: Quên mật khẩu
router.get('/forgot-password', async (req, res) => {
    const { email } = req.query;
    if (email == '') {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đủ thông tin',
        });
    }
    if (email === '') {
        return res.status(400).json({
            message: 'Vui lòng nhập đủ thông tin',
        });
    }
    try {
        // Tìm người dùng với email
        const user = await userModels.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
        }
        // Tạo mã xác nhận ngẫu nhiên
        const confirmationCode = generator.generate();
        await storeConfirmationCode(user._id, confirmationCode, 5 * 60);
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSEMAIL,
            },
        });

        var mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Xác nhận đặt lại mật khẩu',
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
                              <h3>Xin chào, ${req.query.email}</h3>
                              <p><br /></p>
                              <p>
                              Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản của mình. Đây là mã xác nhận để hoàn tất quá trình đặt lại mật khẩu.
                              </p>
                              <p>
                              Vui lòng sử dụng mã xác nhận này trong 5 phút
                               kể từ khi nhận email này. Sau khi nhập mã xác nhận,
                                bạn sẽ được chuyển hướng đến trang để đặt lại mật khẩu.
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
                                  >${confirmationCode}</a
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

                              <p>Nếu bạn không yêu cầu thay đổi mật khẩu, vui lòng bỏ qua email này hoặc liên hệ với chúng tôi ngay lập tức.
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
                console.log('Email sent');
                res.status(200).json({
                    status: true,
                    message: 'Mã xác nhận cơ sở dữ liệu đã được gửi đến email của bạn',
                });
            }
        });
    } catch (error) {
        console.log(`❗  Error: ${error.message}`.bgRed.white.strikethrough.bold);
    }
});
// TODO: Verify Email
router.post('/verify-confirmation-code', async (req, res) => {
    const { email, confirmationCode } = req.body;
    req.body.job === '';
    if (email === '' || confirmationCode === '') {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đủ thông tin',
        });
    }
    try {
        const user = await userModels.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'Người dùng không tồn tại' });
        }
        // * Xác minh mã xác nhận từ cơ sở dữ liệu
        const isValidCode = await verifyConfirmationCode(user._id, confirmationCode);

        if (!isValidCode) {
            return res.status(400).json({ status: false, message: 'Mã xác nhận không hợp lệ' });
        } else {
            return res.status(200).json({ status: true, message: 'Mã xác nhận hợp lệ' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Đã có lỗi xảy ra' });
    }
});
//  TODO: Đổi mật khẩu
router.put('/reset-password', async (req, res) => {
    const { email, newPassword } = req.body;
    if (email === '' || newPassword === '') {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đủ thông tin',
        });
    }
    try {
        const user = await userModels.findOne({ email });
        if (!user) {
            return res.status(404).json({ status: false, message: 'Người dùng không tồn tại' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        console.log(`✅ Mật khẩu đã được đổi`);
        res.status(200).json({ status: true, message: 'Đã đặt lại mật khẩu của bạn' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, message: 'Đã có lỗi xảy ra' });
    }
});
// TODO: Thêm lương + thưởng
router.post('/salary/:id', async (req, res) => {
    const { year, month, salary, bonus } = req.body;
    const userId = req.params.id;
    if (year === '' || month === '' || salary === '' || bonus === '') {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đủ thông tin',
        });
    }
    try {
        const foundUser = await userModels.findById(userId);

        if (foundUser) {
            // * Kiểm tra xem người dùng có tồn tại không
            const newMonthSalary = { month, salary, bonus };
            if (foundUser.salary && foundUser.salary.length > 0) {
                // * Kiểm tra xem người dùng có mảng lương không và mảng đó có dữ liệu không
                const existingYear = foundUser.salary.find((salaryItem) => salaryItem.year === year);

                if (existingYear) {
                    // * Nếu năm đã tồn tại, kiểm tra tháng trong năm đó
                    const existingMonth = existingYear.months.find((monthItem) => monthItem.month === month);

                    if (existingMonth) {
                        // * Nếu tháng đã tồn tại, thông báo lỗi
                        res.status(500).json({
                            status: false,
                            message: `Lương ${year}/${month} của người dùng đã được tạo trước đó`,
                        });
                    } else {
                        // * Thêm thông tin lương vào tháng tương ứng trong năm
                        existingYear.months.push(newMonthSalary);
                    }
                } else {
                    // * Nếu năm chưa tồn tại, tạo một năm mới và thêm thông tin lương vào
                    foundUser.salary.push({ year, months: [newMonthSalary] });
                }
            } else {
                // * Nếu mảng lương chưa tồn tại, tạo một mảng mới và thêm thông tin lương vào
                foundUser.salary = [{ year, months: [newMonthSalary] }];
            }

            await foundUser.save();
            console.log(`✅ Lương cho người dùng đã được cập nhật`);
            res.status(200).json({
                status: true,
                message: `Lương ${year}/${month} đã được thêm`,
            });
        } else {
            res.status(404).send('Không tìm thấy người dùng');
        }
    } catch (error) {
        console.error(`❌ Lỗi: ${error}`);
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});

// TODO: Lấy toàn bộ danh sách lương của người dùng
router.get('/salary/:id', async (req, res) => {
    const userId = req.params.id;
    const { year, month } = req.query;
    if (userId === '') {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đủ thông tin',
        });
    }
    try {
        const foundUser = await userModels.findById(userId);

        if (foundUser) {
            if (year && month) {
                // * Nếu có cả năm và tháng, lấy thông tin lương tháng của năm đó
                const yearSalary = foundUser.salary.find((salary) => salary.year === year);

                if (yearSalary) {
                    const monthSalary = yearSalary.months.find((salary) => salary.month === month);
                    if (monthSalary) {
                        res.status(200).json(monthSalary);
                    } else {
                        res.status(404).json({
                            status: false,
                            message: `Không có thông tin lương cho tháng ${month} năm ${year}`,
                        });
                    }
                } else {
                    res.status(404).json({
                        status: false,
                        message: `Không có thông tin lương cho năm ${year}`,
                    });
                }
            } else if (year) {
                // * Nếu chỉ có năm, lấy toàn bộ danh sách lương của năm đó
                const yearSalary = foundUser.salary.find((salary) => salary.year === year);
                if (yearSalary) {
                    res.status(200).json(yearSalary.months);
                } else {
                    res.status(404).json({
                        status: false,
                        message: `Không có thông tin lương cho năm ${year}`,
                    });
                }
            } else {
                // * Nếu không có năm và tháng, lấy toàn bộ danh sách năm
                res.status(200).json(foundUser.salary);
            }
        } else {
            res.status(404).json({
                status: false,
                message: `Không tìm thấy người dùng`,
            });
        }
    } catch (error) {
        console.error(`❌ Lỗi: ${error}`);

        console.log();
        res.status(404).json({
            status: false,
            message: `🐼 ~ file: userAPI.js:1485 ~ router.get ~ error: ${error}`,
        });
    }
});
// TODO: Cập nhập lương của người dùng
router.put('/salary/:id', async (req, res) => {
    const userId = req.params.id;
    const { year, month } = req.query;
    const { salary, bonus } = req.body;
    if (year === '' || month === '' || salary === '' || bonus === '') {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đủ thông tin',
        });
    }
    try {
        const foundUser = await userModels.findById(userId);

        if (foundUser) {
            if (!year || !month) {
                return res.status(400).send("Yêu cầu cung cấp cả 'year' và 'month' trong query params.");
            }

            const yearSalary = foundUser.salary.find((salaryItem) => salaryItem.year === year);

            if (yearSalary) {
                const monthSalary = yearSalary.months.find((salaryItem) => salaryItem.month === month);

                if (monthSalary) {
                    // * Nếu tìm thấy thông tin lương của tháng, cập nhật thông tin lương
                    monthSalary.salary = salary;
                    monthSalary.bonus = bonus;
                }
            }
            // * Lưu lại thông tin cập nhật
            await foundUser.save();
            res.status(200).json({
                status: true,
                message: `Thông tin lương đã được cập nhật`,
            });
        } else {
            res.status(404).json({
                status: false,
                message: `Không tìm thấy người dùng`,
            });
        }
    } catch (error) {
        console.error(`❌ Lỗi: ${error}`);
        res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
// TODO: Xoá tháng lương người dùng
router.delete('/salary/:userId', async (req, res) => {
    const userId = req.params.userId;
    const { year, month } = req.query;
    if (year === '' || month === '' || userId === '') {
        return res.status(400).json({
            success: false,
            message: 'Vui lòng nhập đủ thông tin',
        });
    }
    try {
        const foundUser = await userModels.findById(userId);

        if (foundUser) {
            if (!year || !month) {
                return res.status(400).send("Yêu cầu cung cấp cả 'year' và 'month' trong query params.");
            }

            const yearSalary = foundUser.salary.find((salaryItem) => salaryItem.year === year);

            if (yearSalary) {
                const monthIndex = yearSalary.months.findIndex((salaryItem) => salaryItem.month === month);

                if (monthIndex !== -1) {
                    // * Nếu tìm thấy thông tin lương của tháng, xoá thông tin đó
                    yearSalary.months.splice(monthIndex, 1);

                    // * Lưu lại thông tin cập nhật
                    await foundUser.save();
                    return res.status(200).json({
                        status: true,
                        message: `Lương người dùng ${month} năm ${year} đã được xoá`,
                    });
                }
            }

            return res.status(404).json({
                status: false,
                message: `Không tìm thấy thông tin lương cho tháng ${month} năm ${year}`,
            });
        } else {
            return res.status(404).json({
                status: false,
                message: `Không tìm thấy người dùng`,
            });
        }
    } catch (error) {
        console.error(`❌ Lỗi: ${error}`);
        return res.status(500).json({
            status: false,
            message: error.message,
        });
    }
});
module.exports = router;


// ! Hàm lưu mã xác nhận vào cơ sở dữ liệu
async function storeConfirmationCode(userId, code, expirationTimeInSeconds) {
    try {
        const user = await userModels.findById(userId);

        if (user) {
            user.confirmationCode = code;
            user.confirmationCodeExpiration = Date.now() + expirationTimeInSeconds * 1000;
            await user.save();
            console.log('Mã xác nhận đã được lưu vào cơ sở dữ liệu.');
        } else {
            console.error('Người dùng không tồn tại.');
        }
    } catch (error) {
        console.error('Lỗi khi lưu mã xác nhận:', error);
    }
}
// ! Hàm xác minh mã xác nhận từ cơ sở dữ liệu
async function verifyConfirmationCode(userId, code) {
    try {
        const user = await userModels.findById(userId);

        if (user && user.confirmationCode === code && user.confirmationCodeExpiration > Date.now()) {
            // * Xác nhận mã xác nhận nếu mã trùng khớp và chưa hết hạn
            console.log('Mã xác nhận hợp lệ.');
            return true;
        } else {
            console.log('Mã xác nhận không hợp lệ.');
            return false;
        }
    } catch (error) {
        console.error('Lỗi khi xác minh mã xác nhận:', error);
        return false;
    }
}
