const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

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
    type: String,
    required: true,
    validate(value) {
      const validFormats = ["image/jpeg", "image/png"];
      if (!validFormats.includes(value.contentType)) {
        throw new Error("Photo must be in JPEG or PNG format");
      }
    },
  },
  cv: {
    type: String,
    required: true,
    validate(value) {
      if (value.contentType !== "application/pdf") {
        throw new Error("CV must be in PDF format");
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

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

const userModel = mongoose.model("User", userSchema);

module.exports = { userModel };
