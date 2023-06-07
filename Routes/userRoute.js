const express = require('express');
const userRouter = express.Router();
const authController = require('../Controller/authController');
const router = express.Router();
const userController = require('../Controller/userController');
userRouter.post('/Signup', authController.signUp);

userRouter
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
userRouter
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = userRouter;
