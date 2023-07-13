const express = require('express');
const userRouter = express.Router();
const authController = require('../Controller/authController');
const router = express.Router();
const userController = require('../Controller/userController');
userRouter.post('/Signup', authController.signUp);
userRouter.post('/Login', authController.login);
userRouter.post('/forgotPassword', authController.forgetPassword);
userRouter.patch('/resetPassword/:token', authController.resetPassword);

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
