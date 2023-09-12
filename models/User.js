const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");


const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lütfen adınızı yazınız !"],
  },
  email: {
    type: String,
    required: [true, "Lütfen E-posta adresinizi yazın"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Lütfen E-posta adresinizi doğru yazın !",
    ],
  },
  password: {
    type: String,
    minlength: 4,
    required: [true, "Lütfen şifrenizi yazınız !"],
    select: false,
  },
  gender: {
    type: Boolean,
    required: [true, "Lütfen kullanıcının cinsiyetini yazın !"],
  },
  dateOfBirth: {
    type: Date,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

UserSchema.methods.getJWT = function () {
  const token = jwt.sign(
    { id: this._id},
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRESIN,
    }
  );
  return token;
};

UserSchema.methods.checkPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.pre("save", async function (next) {
  // Нууц үг өөрчлөгдөөгүй бол дараачийн middleware рүү шилж
  if (!this.isModified("password")) next();

  // Нууц үг өөрчлөгдсөн
  console.time("salt");
  const salt = await bcrypt.genSalt(10);
  console.timeEnd("salt");

  console.time("hash");
  this.password = await bcrypt.hash(this.password, salt);
  console.timeEnd("hash");
});
module.exports = mongoose.model("User", UserSchema);
