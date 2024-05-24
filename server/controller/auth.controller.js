const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

const { userModel } = require("../models/user.model");
const { verifyRecaptcha } = require("../service/recaptcha");

// user signup
const signup = async (req, res) => {
  const { username, email, password, dateOfBirth, recaptchaToken } = req.body;
  try {
    const isHuman = await verifyRecaptcha(recaptchaToken);
    if (!isHuman) {
      return res
        .status(400)
        .json({ ok: false, message: "reCAPTCHA verification failed" });
    }
    if (req.fileValidationError) {
      return res
        .status(400)
        .json({ ok: false, message: req.fileValidationError });
    }
    if (!username || !email || !password || !dateOfBirth) {
      return res
        .status(400)
        .json({ ok: false, message: "All fields are required." });
    }
    if (!req.files || !req.files["photo"] || !req.files["cv"]) {
      return res
        .status(400)
        .json({ ok: false, message: "Photo and CV are required." });
    }
    const photo = req.files["photo"][0];
    const cv = req.files["cv"][0];
    const photoBuffer = await fs.readFile(photo.path);
    const cvBuffer = await fs.readFile(cv.path);
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new userModel({
      username,
      email,
      password: hashedPassword,
      dateOfBirth,
      photo: {
        data: photoBuffer,
        contentType: photo.mimetype,
      },
      cv: {
        data: cvBuffer,
        contentType: cv.mimetype,
      },
    });
    await user.save();
    await fs.unlink(photo.path);
    await fs.unlink(cv.path);
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
    const user = await userModel.findOne({ username }).select('-photo -cv');
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
    return res.status(200).json({ ok: true, token, isAdmin: user.isAdmin });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ ok: false, message: err.message || "Server error" });
  }
};

module.exports = { login, signup };
