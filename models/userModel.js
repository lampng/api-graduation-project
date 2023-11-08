const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: false,
    },
    role: {
      type: String,
      require: true,
    },

    job: {
      type: String,
      require: false,
    },
    address: {
      type: String,
      require: false,
    },
    phone: {
      type: String,
      require: false,
    },
    birthday: {
      type: String,
      require: false,
    },
    avatar: {
      type: String,
      require: false,
    },
    cloudinary_id: {
      type: String,
      require: false,
    },
    active: {
      type: String,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const user = mongoose.model("user", userSchema);

module.exports = user;
