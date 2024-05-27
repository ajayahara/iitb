const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const allowedPhotoTypes = ['image/png', 'image/jpeg'];
const allowedCvTypes = ['application/pdf'];
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    validate(value) {
      if (!validator.isAlphanumeric(value)) {
        throw new Error("Username must be alphanumeric");
      }
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalid email address");
      }
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    trim: true,
    validate(value) {
      if (!validator.isStrongPassword(value)) {
        throw new Error("Password must be strong");
      }
    },
  },
  dateOfBirth: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isDate(value)) {
        throw new Error("Date of birth must be valid");
      }
    },
  },
  photo: {
    data: Buffer,
    contentType: {
      type: String,
      validate: {
        validator: function(v) {
          return allowedPhotoTypes.includes(v);
        },
        message: props => `${props.value} is not a valid photo content type!`
      }
    },
  },
  cv: {
    data: Buffer,
    contentType:  {
      type: String,
      validate: {
        validator: function(v) {
          return allowedCvTypes.includes(v);
        },
        message: props => `${props.value} is not a valid CV content type!`
      }
    },
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = { userModel };
