const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const handleCastErrorDB = (err) => {
  const message = `Invaid ${err.pathj}: ${err.value}`;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const handleDuplicateFeildsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/);
  console.log(value);
  const message = `Duplicate Feild Value: ${value}. Please Use Another Feild`;

  return new AppError(message, 400);
};
const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log('Error hai');
    res.status(500).json({
      status: 'error',
      message: 'Something Went Wrong',
    });
  }
};
module.exports = (err, req, res, next) => {
  //
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'devlopment') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };

    if (error.name === 'CastError') err = handleCastErrorDB(error);
    if (error.code === 110000) error = handleDuplicateFeildsDB(error);
    sendErrorProd(error, res);
  }
};
