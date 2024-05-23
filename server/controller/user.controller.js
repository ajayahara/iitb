const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs").promises;

const { userModel } = require("../models/user.model");

// user signup
const signup = async (req, res) => {
  try {
    if (req.fileValidationError) {
      return res
        .status(400)
        .json({ ok: false, message: req.fileValidationError });
    }
    const { username, email, password, dateOfBirth } = req.body;
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
  try {
    const { username, password } = req.body;
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
    return res.status(200).json({ ok: true, token, isAdmin: user.isAdmin });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ ok: false, message: err.message || "Server error" });
  }
};

// get all user for admin
const getAllUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      ok: false,
      message: "Unauthorized: Only admins can access all users",
    });
  }
  try {
    const users = await userModel.find();
    return res.status(200).json({ ok: true, users });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

// get the user by its id. user can access its own document but admin have access to see the user details.
const getUserById = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.user;

  try {
    if (id != userId || !isAdmin) {
      return res.status(403).json({
        ok: false,
        message: "Unauthorized: Only admins or its own user can access.",
      });
    }
    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    return res.status(200).json({ ok: true, user });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

// update user by id. Only user can update its details except isAdmin & isVerified. Admin can update all the field except isAdmin.
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.user;
  const { username, email, dateOfBirth, photo, cv, isVerified } = req.body;
  if (id !== userId && !isAdmin) {
    return res.status(403).json({
      ok: false,
      message: "Unauthorized: You or Admin can only update your own profile",
    });
  }
  try {
    if (!isAdmin) {
      const updatedUser = await userModel.findByIdAndUpdate(
        id,
        { username, email, dateOfBirth, photo, cv },
        {
          new: true,
        }
      );
      if (!updatedUser) {
        return res.status(404).json({ ok: false, message: "User not found" });
      }
      return res.status(200).json({ ok: true, updatedUser });
    }
    const updatedUser = await userModel.findByIdAndUpdate(
      id,
      { username, email, dateOfBirth, photo, cv, isVerified },
      {
        new: true,
      }
    );
    if (!updatedUser) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    return res.status(200).json({ ok: true, updatedUser });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

// delete user by its id. only user can delete its own account but admin can delete any.
const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.user;
  if (id !== userId || !isAdmin) {
    return res.status(403).json({
      ok: false,
      message: "Unauthorized: You can only delete your own account",
    });
  }
  try {
    const deletedUser = await userModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ ok: true, message: "User deleted successfully" });
  } catch (err) {
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

module.exports = {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
