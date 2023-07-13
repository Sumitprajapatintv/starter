const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('./../model/userModel');
const catchasync = require('./../utils/catchasync');
const AppError = require('../utils/appError');
const sendEmail = require('./../utils/email');

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
    passwordChangedAt: req.body.passwordChangedAt,
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
  // console.log(await user.correctPassword(password, user.password));

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

exports.protect = catchasync(async (req, res, next) => {
  let token;
  console.log(req.headers);
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log('token value', token);
  if (!token) {
    return next(
      new AppError('You are not logged In Plase Login To get Access', 401),
      401
    );
  }
  //
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log('decoded value', decoded);

  //3-Check If User Still Exist
  const freashUser = await User.findById(decoded.id);
  console.log('userDeatils', freashUser);
  // throw new AppError('The User Belong This Token Does Not Exist', 401);
  if (!freashUser) {
    next(new AppError('The User Belong This Token Does Not Exist', 401));
  }
  // 4) Check if user changed password after the token was issued
  if (freashUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = freashUser;
  next();
});
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};

exports.forgetPassword = catchasync(async (req, res, next) => {
  //Get User Based On Post Email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with This email Adress'), 404);
  }
  //Generate The Random Rest Token
  const resetToken = user.createPasswordResetToken();
  console.log(resetToken);
  await user.save({ validateBeforeSave: false });

  //Sebd It to User Email
  // 3) Send it to user's email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;
  console.log(resetURL);
  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});
exports.resetPassword = async (req, res, next) => {};
