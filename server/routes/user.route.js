const express = require("express");
const { signup, login } = require("../controller/user.controller");
const { upload } = require("../config/multer");

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

module.exports = { userRouter };
