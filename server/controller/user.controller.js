const { isStrongPassword } = require("validator");
const { userModel } = require("../models/user.model");

// get all user for admin
const getAllUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      ok: false,
      message: "Unauthorized: Only admins can access all users",
    });
  }

  try {
    const { page = 1, limit = 10, isVerified } = req.query;
    const filter = {
      isAdmin: false,
    };
    if (isVerified !== undefined) {
      filter.isVerified = isVerified === "true";
    }
    const skip = (page - 1) * limit;
    const users = await userModel
      .find(filter)
      .select("-password -photo -cv")
      .skip(skip)
      .limit(parseInt(limit));
    const totalUsers = await userModel.countDocuments(filter);
    return res.status(200).json({
      ok: true,
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: parseInt(page),
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

// get the user by its id. user can access its own document but admin have access to see the user details.
const getUserById = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.user;
  try {
    if (!isAdmin && id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "Unauthorized: Only admins or its own user can access.",
      });
    }
    const user = await userModel.findById(id).select("-password");
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    const photoBase64 = user.photo.data.toString("base64");
    const cvBase64 = user.cv.data.toString("base64");
    const photo = {
      data: photoBase64,
      contentType: user.photo.contentType,
    };
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
      cv,
    };
    return res.status(200).json({ ok: true, user: details });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

// update user by id. Only user can update its details except isAdmin & isVerified. Admin can update all the field except isAdmin.
const updateUserById = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.user;
  const { username, email, password, dateOfBirth, photo, cv, isVerified } =
    req.body;
  try {
    if (!isAdmin && id !== userId) {
      return res.status(403).json({
        ok: false,
        message: "Unauthorized: You or Admin can only update your own profile",
      });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    const updateFields = {};

    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (dateOfBirth) updateFields.dateOfBirth = dateOfBirth;

    if (password) {
      if (!isStrongPassword(password)) {
        res.status(404).json({ ok: false, message: "Not a strong password" });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      updateFields.password = hashedPassword;
    }

    if (photo && photo.data) {
      updateFields.photo = photo;
    }

    if (cv && cv.data) {
      updateFields.cv = cv;
    }

    if (isAdmin && isVerified != undefined) {
      updateFields.isVerified = isVerified;
    }

    await userModel.findByIdAndUpdate(id, updateFields);
    return res.status(200).json({ ok: true, message: "Updated Successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

// delete user by its id. only user can delete its own account but admin can delete any.
const deleteUserById = async (req, res) => {
  const { id } = req.params;
  const { userId, isAdmin } = req.user;
  if (!isAdmin && id !== userId) {
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
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
};
