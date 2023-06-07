const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
//create Schema
const validator = require('validator');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please Tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please Provide Your Email Address'],
    lowercase: true,
    validate: [validator.isEmail, 'Please Provide a valid email address'],
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      //This Only Work On Create And Save
      validator: function (el) {
        return el === this.password;
      },
      message: 'Password are not same in this Case',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = await bcrypt.hash(this.passwordConfirm, 12);
  //this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
