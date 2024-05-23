const express = require("express");
const {
  signup,
  login,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controller/user.controller");
const { upload } = require("../config/multer");
const { verifyJWT } = require("../middleware/authorization.middleware");

const userRouter = express.Router();

userRouter.post(
  "/signup",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  signup
);

userRouter.post("/login", login);
userRouter.get("/", verifyJWT, getAllUsers);
userRouter.get("/:id", verifyJWT, getUserById);
userRouter.patch("/:id", verifyJWT, updateUserById);
userRouter.delete("/:id", verifyJWT, deleteUserById);

module.exports = { userRouter };
