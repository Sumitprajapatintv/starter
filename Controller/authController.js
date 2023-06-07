const jwt = require('jsonwebtoken');
const User = require('./../model/userModel');
const catchasync = require('./../utils/catchasync');
const AppError = require('../utils/appError');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signUp = catchasync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  //console.log(newUser);
  const token = signToken(newUser._id);
  res.status(201).json({
    status: 'sucess',
    token,
    data: {
      user: newUser,
    },
  });
});

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email);
  // console.log(password);

  //1)checck if email and password is exist

  if (!email || !password) {
    return next(new AppError('Please Provide Email and Password', 400));
  }

  //2 Check If User Exist and Passord Is correct

  const user = await User.findOne({ email }).select('+password');
  console.log(user);
  console.log(await user.correctPassword(password, user.password));

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect Email Or Password', 401));
  }

  console.log(user);

  //3 if Everythink ok send token to client

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token,
  });
};
