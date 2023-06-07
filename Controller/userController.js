const User = require('./../model/userModel');
const catchasync = require('../utils/catchasync');
exports.getAllUsers = catchasync(async (req, res, next) => {
  const user = await User.find();

  //Send Response
  res.status(200).json({
    status: 'success',
    result: user.length,
    data: {
      user: user,
    },
  });
});
exports.createUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This Route is Not Defined yet',
  });
};
exports.getUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This Route is Not Defined yet',
  });
};
exports.updateUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This Route is Not Defined yet',
  });
};
exports.deleteUser = (req, res) => {
  return res.status(500).json({
    status: 'error',
    message: 'This Route is Not Defined yet',
  });
};
