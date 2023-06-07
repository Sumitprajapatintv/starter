const express = require('express');

const tourcontroller = require('../Controller/tourController');
const { router } = require('../App');
const tourRouter = express.Router();
const checkID = require('../Controller/tourController');

// tourRouter.param('id', tourcontroller.checkID);
tourRouter
  .route('/top-5-cheap')
  .get(tourcontroller.aliasTopTour, tourcontroller.getAllTour);

tourRouter.route('/tour-stats').get(tourcontroller.getTourStats);
tourRouter.route('/monthly-plan/:year').get(tourcontroller.getMonthlyPlan);
tourRouter
  .route('/')
  .get(tourcontroller.getAllTour)
  .post(tourcontroller.createTour);
tourRouter
  .route('/:id')
  .get(tourcontroller.getTour)
  .patch(tourcontroller.updateTour)
  .delete(tourcontroller.deletedTour);

module.exports = tourRouter;
