const express = require('express');
const app = express();
const fs = require('fs');
const morgan = require('morgan');
const tourRouter = require('./Routes/tourRoute');
const userRouter = require('./Routes/userRoute');
const AppError = require('./utils/appError');
const globalErrorhandler = require('./Controller/errorController');
const port = 8080;
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === 'devlopment') {
  app.use(morgan('dev'));
}

app.use((req, res, next) => {
  req.requestTimeAt = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Cant Find ${req.originalUrl} on this server!`));
});

app.use(globalErrorhandler);

module.exports = app;
