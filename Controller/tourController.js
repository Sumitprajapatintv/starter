// const fs = require('fs');
// const tours = JSON.parse(fs.readFileSync('./dev-data/data/tours-simple.json'));
const AppError = require('../utils/appError');
const Tour = require('./../model/tourmodel');
const APIFeatures = require('./../utils/apiFeatures');
const catchAsync = require('./../utils/catchasync');
exports.aliasTopTour = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingAverage,price';
  req.query.feilds = 'name,price,ratinAverage,summary,difficulty';
  next();
};
exports.getAllTour = catchAsync(async (req, res) => {
  const features = new APIFeatures(Tour.find(), req.query)
    .filter()
    .sort()
    .limitFeild()
    .pagination();

  const tours = await features.query;
  res.status(200).json({
    status: 'success',
    Middleware: req.requestTimeAt,
    data: {
      tours: tours,
    },
  });
});
exports.getTour = catchAsync(async (req, res) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new AppError('No Tour Found with that id'), 404);
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});
//console.log(tours[tours.length - 1].id + 1);

exports.createTour = catchAsync(async (req, res, next) => {
  const newTour = await Tour.create(req.body);

  res.status(200).json({
    status: 'success',
    data: {
      tour: newTour,
    },
  });
});

exports.updateTour = catchAsync(async (req, res) => {
  const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
});

exports.deletedTour = catchAsync(async (req, res) => {
  await Tour.findByIdAndDelete(req.params.id);
  return res.status(404).json({
    status: 'success',
    message: 'Docuement Deleeted Suceefully',
  });
});

exports.getTourStats = async (req, res) => {
  const stats = await Tour.aggregate([
    {
      $match: {
        ratingAverage: { $gte: 4.5 },
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
};
exports.getMonthlyPlan = async (req, res) => {
  const year = req.params.year * 1;
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: {
      plan,
    },
  });
};
