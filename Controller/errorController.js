const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');

const handleCastErrorDB = () => {
  const message = `Invaid ${err.pathj}: ${err.value}`;
  return new AppError(message, 400);
};
const handleJWTExpiredeError = () =>
  new AppError('You Token Has expired Please Login Again ', 401);
const handleJWTError = () =>
  new AppError('Invalid Token Please Login in again ', 401);
const sendErrorDev = (err, res) => {
  console.log('reached error dev');
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
    console.log('Error hai', err);
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

  console.log('env value 2', process.env.NODE_ENV);
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'CastError') error = handleCastErrorDB();
    if (error.code === 110000) error = handleDuplicateFeildsDB();

    if (error.name === 'TokenExpiredError') error = handleJWTExpiredeError();
    sendErrorProd(err, res);
  }
  // sendErrorProd(err, res);
};
