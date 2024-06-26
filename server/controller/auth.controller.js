const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { userModel } = require("../models/user.model");
const { verifyRecaptcha } = require("../service/recaptcha");
const { isStrongPassword } = require("validator");

// user signup
const signup = async (req, res) => {
  const { username, email, password, dateOfBirth, photo, cv, recaptchaToken } =
    req.body;
  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res
        .status(400)
        .json({ ok: false, message: "reCAPTCHA verification failed" });
    }
    if (!username || !email || !password || !dateOfBirth || !photo || !cv) {
      return res
        .status(400)
        .json({ ok: false, message: "All fields are required." });
    }

    // Hash the password
    if (!isStrongPassword(password)) {
      return res
        .status(400)
        .json({ ok: false, message: "Password is not strong" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
      photo,
      cv,
    });
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "Signup successful! Please log in." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ ok: false, message: err.message || "Signup failed!" });
  }
};

// user or admin login
const login = async (req, res) => {
  const { username, password, recaptchaToken } = req.body;
  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res
        .status(400)
        .json({ ok: false, message: "reCAPTCHA verification failed" });
    }
    if (!username || !password) {
      return res
        .status(400)
        .json({ ok: false, message: "Invalid username or password." });
    }
    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid username or password." });
    }
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ ok: false, message: "Wait for admin to verify your account." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid username or password" });
    }
    // Generate JWT
    const payload = { userId: user._id, isAdmin: user.isAdmin };
    const secret = process.env.SECRET;
    const token = jwt.sign(payload, secret, { expiresIn: "1D" });
    const photoBase64 = user.photo.data.toString("base64");
    const photo = {
      data: photoBase64,
      contentType: user.photo.contentType,
    };
    const cvBase64 = user.cv.data.toString("base64");
    const cv = {
      data: cvBase64,
      contentType: user.cv.contentType,
    };
    const details = {
      _id: user._id,
      username: user.username,
      email: user.email,
      dateOfBirth: user.dateOfBirth,
      photo,
      cv
    };
    return res
      .status(200)
      .json({ ok: true, token, isAdmin: user.isAdmin, details });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ ok: false, message: err.message || "Server error" });
  }
};

module.exports = { login, signup };
