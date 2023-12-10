require("colors");
// mongodb user model
const userModels = require("../models/userModel");
const clientModels = require("../models/clientModel");
const ServiceModels = require("../models/ServiceModel");
const OrderModels = require("../models/orderModel.js")
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
// TODO: ✅ Tạo dịch vụ
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
// ! Sắp xếp giảm dần
// TODO: ✅ Gọi danh sách dịch vụ
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
// TODO: ✅ Gọi chi tiết dịch vụ ([:id] = id của dịch vụ)
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
// TODO: ✅ Cập nhập dịch vụ
router.put("/update/:id", upload.single("image"), async (req, res) => {
  try {
    const check = await ServiceModels.findOne({
      name: req.body.name
    });
    const service = await ServiceModels.findById(req.params.id);

    const data = {
      name: req.body.name || service.name,
      description: req.body.description || service.description,
      price: req.body.price || service.price,
    };

    if (check && removeDiacriticsAndSpaces(req.body.name) === removeDiacriticsAndSpaces(service.name)) {
      return res.status(500).json({
        Error: "Tên dịch vụ này đã tồn tại"
      });
    }

    if (req.file != null) {
      if (service.cloudinary_id != null) {
        await cloudinary.uploader.destroy(service.cloudinary_id);
      }
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "api-graduation-project/service",
      });
      data.image = result.secure_url || service.image;
      data.cloudinary_id = result.public_id || service.cloudinary_id;
    } else {
      data.image = service.image;
      data.cloudinary_id = service.cloudinary_id;
    }

    await ServiceModels.findByIdAndUpdate(service.id, data, {
      new: true
    });

    console.log(`✅ Cập nhập dịch vụ thành công`.green.bold);
    res.status(200).json({
      status: "Cập nhập dịch vụ thành công"
    });
  } catch (error) {
    console.log(`❗ Cập nhập dịch vụ thất bại`.bgRed.white.strikethrough.bold);
    res.status(500).json({
      message: "Cập nhập dịch vụ thất bại",
    });
  }
});
// TODO: ✅ Xoá dịch vụ ([:id] = id của dịch vụ )
// router.delete("/delete/:id", async (req, res) => {
//   try {
//     const service = await ServiceModels.findByIdAndDelete(req.params.id);

//     // Xoá tệp trên Cloudinary liên quan đến người dùng
//     if (service.cloudinary_id) {
//       await cloudinary.uploader.destroy(service.cloudinary_id);
//       console.log(
//         `✅ Đã xoá tệp trên Cloudinary của dịch vụ: ${service.cloudinary_id}`
//       );
//     }
//     console.log(`✅ Xoá thành công`);
//     res.status(200).json(service);
//   } catch (error) {
//     console.log(`❗  Không tìm thấy dịch vụ`.bgRed.white.strikethrough.bold);
//     res.status(500).json({
//       message: "Không tìm thấy dịch vụ",
//     });
//   }
// });
router.delete("/delete/:id", async (req, res) => {
  try {
    // * Kiểm tra xem dịch vụ có nằm trong hóa đơn nào không
    const isServiceInOrder = await OrderModels.findOne({
      'services.serviceID': req.params.id
    });
    // * Nếu dịch vụ tồn tại trong hóa đơn, không cho phép xóa
    if (isServiceInOrder) {
      return res.status(400).json({
        message: "Dịch vụ này không thể xóa vì đã có trong hóa đơn."
      });
    }
    // * Nếu dịch vụ không nằm trong hóa đơn, tiếp tục quá trình xóa
    const service = await ServiceModels.findByIdAndDelete(req.params.id);
    // * Xoá tệp trên Cloudinary liên quan đến dịch vụ
    if (service.cloudinary_id) {
      await cloudinary.uploader.destroy(service.cloudinary_id);
      console.log(`✅ Đã xoá tệp trên Cloudinary của dịch vụ: ${service.cloudinary_id}`);
    }
    console.log(`✅ Xoá thành công`);
    res.status(200).json({
      message: "Dịch vụ đã được xóa thành công",
      service: service.name
    });
  } catch (error) {
    console.error(`❗ Không tìm thấy dịch vụ`);
    res.status(500).json({
      message: "Không tìm thấy dịch vụ hoặc có lỗi xảy ra"
    });
  }
});
// TODO: Chặn xoá dịch vụ khi có trong hoá đơn chưa hoàn thành

// ! Hàm cập nhật thông tin dịch vụ trong các đơn hàng
async function updateOrdersWithServiceInfo(serviceID, newServiceInfo) {
  try {
    // Tìm và cập nhật các đơn hàng có chứa serviceID
    const updateResult = await orderModel.updateMany({
        "services.serviceID": serviceID
      }, // Điều kiện tìm đơn hàng có serviceID
      {
        $set: {
          "services.$[elem].serviceID": newServiceInfo
        }
      }, // Cập nhật thông tin dịch vụ mới
      {
        arrayFilters: [{
          "elem.serviceID": serviceID
        }]
      } // Lọc các phần tử có serviceID
    );

    return updateResult;
  } catch (error) {
    console.error("Error updating orders with service info:", error);
    throw error;
  }
}
// ! Hàm loại bỏ dấu và khoảng cách
function removeDiacriticsAndSpaces(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '');
}
module.exports = router;