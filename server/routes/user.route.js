const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controller/user.controller");
const { verifyJWT } = require("../middleware/authorization.middleware");

const userRouter = express.Router();

userRouter.get("/", verifyJWT, getAllUsers);
userRouter.get("/:id", verifyJWT, getUserById);
userRouter.patch("/:id", verifyJWT, updateUserById);
userRouter.delete("/:id", verifyJWT, deleteUserById);

module.exports = { userRouter };
