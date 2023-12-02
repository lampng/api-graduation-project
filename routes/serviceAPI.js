require("colors");
// mongodb user model
const userModels = require("../models/userModel");
const clientModels = require("../models/clientModel");
const ServiceModels = require("../models/ServiceModel");
require("dotenv").config();
const session = require("express-session");
//Tải lên ảnh
const cloudinary = require("../middleware/cloudinary.js");
const upload = require("../middleware/upload");
var express = require("express");
const {
  array
} = require("../middleware/upload");
var router = express.Router();

router.get("/", (req, res) => {
  res.json({
    status: "Đang phát triển",
    "Tạo dịch vụ(POST):": `https://api-graduation-project-production.up.railway.app/service/create/`,
    "Gọi danh sách dịch vụ(GET):": `https://api-graduation-project-production.up.railway.app/service/list/`,
    "Gọi chi tiết dịch vụ(GET):": `https://api-graduation-project-production.up.railway.app/service/detail/:id`,
    "Cập nhập dịch vụ(PUT):": `https://api-graduation-project-production.up.railway.app/service/update/:id`,
    "Xoá dịch vụ(DELETE):": `https://api-graduation-project-production.up.railway.app/service/delete/:id`,
  });
});
// TODO: Tạo dịch vụ
router.post("/create/", upload.single("image"), async (req, res) => {
  try {
    let service = await ServiceModels.findOne({
      name: req.body.name
    });
    if (service) {
      return res.status(500).json({
        Error: "Dịch vụ này đã tồn tại"
      });
    } else {
      if (req.file != null) {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "api-graduation-project/service",
        });
        const newService = new ServiceModels({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          quantityImage: req.body.quantityImage,
          image: result.secure_url,
          cloudinary_id: result.public_id,
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
      } else {
        res.status(500).json({
          Error: "Vui lòng thêm hình ảnh",
        });
      }
    }
  } catch (error) {
    console.log(`❗  ${error}`.bgRed.white.strikethrough.bold);
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
// TODO: Cập nhập dịch vụ
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    let check = await ServiceModels.findOne({
      name: req.body.name
    });
    let service = await ServiceModels.findById(req.params.id)
    if (check) {
      // TODO: sử dụng removeDiacriticsAndSpaces để kiểm tra trùng lặp dịch vụ
      // * removeDiacriticsAndSpaces: xoá dấu và khoảng cách để kiểm tra chính xác hơn.
      if (removeDiacriticsAndSpaces(req.body.name) == removeDiacriticsAndSpaces(service.name)) {
        if (req.file != null) {
          if (service.cloudinary_id != null) {
            await cloudinary.uploader.destroy(service.cloudinary_id);
          }
          const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "api-graduation-project/service", 
          });
          const data = {
            name: req.body.name,
            description: req.body.description,
            price: req.body.price,
            quantityImage: req.body.quantityImage,
            image: result.secure_url || service.image,
            cloudinary_id: result.public_id || service.cloudinary_id,
          };
          await ServiceModels
            .findByIdAndUpdate(service.id, data, {
              new: true,
            })
            .then((doc) => {
              console.log(
                `✅  Cập nhập dịch vụ (hình ảnh) thành công`.green.bold
              );
              res.status(200).json({
                status: "Cập nhập dịch vụ (hình ảnh) thành công",
              });
            })
            .catch((err) => {
              console.log(`Lỗi catch: `.bgRed, err);
            });
        } else {
          const data = {
            name: req.body.name || service.name,
            description: req.body.description || service.name,
            price: req.body.price || service.name,
            quantityImage: req.body.quantityImage || service.quantityImage,
          };
          await ServiceModels
            .findByIdAndUpdate(service.id, data, {
              new: true,
            })
            .then((doc) => {
              console.log(
                `✅  Cập nhập dịch vụ thành công`.green.bold
              );
              res.status(200).json({
                status: "Cập nhập dịch vụ thành công",
              });
            })
            .catch((err) => {
              console.log(`Lỗi catch: `.bgRed, err);
            });
        }
      } else {
        return res.status(500).json({
          Error: "Tên dịch vụ này đã tồn tại"
        });
      }
    } else {
      if (req.file != null) {
        if (service.cloudinary_id != null) {
          await cloudinary.uploader.destroy(service.cloudinary_id);
        }
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "api-graduation-project/service",
        });
        const data = {
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          image: result.secure_url || service.avatar,
          cloudinary_id: result.public_id || service.cloudinary_id,
        };
        await ServiceModels
          .findByIdAndUpdate(service.id, data, {
            new: true,
          })
          .then((doc) => {
            console.log(
              `✅  Cập nhập dịch vụ (hình ảnh) thành công`.green.bold
            );
            res.status(200).json({
              status: "Cập nhập dịch vụ (hình ảnh) thành công",
            });
          })
          .catch((err) => {
            console.log(`Lỗi catch: `.bgRed, err);
          });
      } else {
        const data = {
          name: req.body.name || service.name,
          description: req.body.description || service.name,
          price: req.body.price || service.name,
          quantityImage: req.body.quantityImage || service.quantityImage,
        };
        await ServiceModels
          .findByIdAndUpdate(service.id, data, {
            new: true,
          })
          .then((doc) => {
            console.log(
              `✅  Cập nhập dịch vụ thành công`.green.bold
            );
            res.status(200).json({
              status: "Cập nhập dịch vụ thành công",
            });
          })
          .catch((err) => {
            console.log(`Lỗi catch: `.bgRed, err);
          });
      }

    }

  } catch (error) {
    console.log(`❗  Cập nhập dịch vụ thất bại`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: "Cập nhập dịch vụ thất bại",
    });
  }
});
// TODO: Xoá dịch vụ ([:id] = id của dịch vụ )
router.delete("/delete/:id", async (req, res) => {
  try {
    const service = await ServiceModels.findByIdAndDelete(req.params.id);

    // Xoá tệp trên Cloudinary liên quan đến người dùng
    if (service.cloudinary_id) {
      await cloudinary.uploader.destroy(service.cloudinary_id);
      console.log(
        `✅ Đã xoá tệp trên Cloudinary của dịch vụ: ${service.cloudinary_id}`
      );
    }
    console.log(`✅ Xoá thành công`);
    res.status(200).json(service);
  } catch (error) {
    console.log(`❗  Không tìm thấy dịch vụ`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: "Không tìm thấy dịch vụ",
    });
  }
});
// ! Hàm loại bỏ dấu và khoảng cách
function removeDiacriticsAndSpaces(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '');
}
module.exports = router;