const asyncHandler = require("express-async-handler")
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const User = require('../models/User')
const CustomError = require('../utils/customError')


// auth
exports.login = asyncHandler(async (req,res)=>{
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Lütfen e-postanızı ve şifrenizi gönderin !", 400);
  }

  // find customer acc
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    throw new CustomError("Lütfen e-posta adresinizi ve şifrenizi doğru giriniz !", 401);
  }

  const ok = await user.checkPassword(password);

  if (!ok) {
    throw new CustomError("E-posta adresiniz ve şifreniz yanlış !", 401);
  }

  const token = user.getJWT();

  const cookieOption = {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  res.status(200).cookie("kiss-token", token, cookieOption).json({
    success: true,
    token,
    user: user,
  });
});

exports.signup = asyncHandler(async (req,res)=>{
  const user = await User.create(req.body);

  const token = user.getJWT();

  res.status(200).json({
    success: true,
    token,
    user: user,
  });
});