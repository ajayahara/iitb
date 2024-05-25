const express = require("express");
const { login, signup } = require("../controller/auth.controller");
const { upload } = require("../config/multer");
const { uploader } = require("../middleware/uploader.middleware");

const authRouter = express.Router();

authRouter.post(
  "/signup",
  upload.fields([
    { name: "photo", maxCount: 1 },
    { name: "cv", maxCount: 1 },
  ]),
  uploader,
  signup
);

authRouter.post("/login", login);

module.exports = { authRouter };
