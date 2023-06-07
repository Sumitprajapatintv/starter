const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchasync = require('./../utils/catchasync');
const AppError = require('../utils/appError');

exports.signUp = catchasync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  console.log(newUser);
  // const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
  //   expiresIn: process.env.JWT_EXPIRES_IN,
  // });
  res.status(201).json({
    status: 'sucess',
    data: {
      user: newUser,
    },
  });
});

// exports.login = (req, res, next) => {
//   const { email, password } = req.body;

//   //1)checck if email and password is exist

//   if (!email || !password) {
//     next(new AppError('Please Provide Email and Password', 400));
//   }

//   //2 Check If User Exist and Passord Is Incorrect

//   //3 if Everythink ok send token to client

//   const token = '';

//   res.status(200).json({
//     status: 'success',
//     token,
//   });
// };
