const express = require("express");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
} = require("../controller/user.controller");
const { verifyJWT } = require("../middleware/authorization.middleware");
const { upload } = require("../config/multer");
const { uploader } = require("../middleware/uploader.middleware");

const userRouter = express.Router();

userRouter.get("/", verifyJWT, getAllUsers);
userRouter.get("/:id", verifyJWT, getUserById);
userRouter.patch(
  "/:id",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  verifyJWT,
  uploader,
  updateUserById
);
userRouter.delete("/:id", verifyJWT, deleteUserById);

module.exports = { userRouter };
