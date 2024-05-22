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
    const photoPath = req.files?.photo?.[0].path;
    const cvPath = req.files?.cv?.[0].path;
    const user = new userModel({
      username,
      email,
      password,
      dateOfBirth,
      photo: photoPath,
      cv: cvPath,
    });
    await user.save();
    return res
      .status(200)
      .json({ ok: true, message: "Signup successful! Please log in." });
  } catch (err) {
    res
      .status(500)
      .json({ ok: false, message: err.message || "Signup failed!" });
  }
};
// user or admin login

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userModel.findOne({ username });
    if (!user) {
      return res
        .status(401)
        .json({ ok: false, message: "Invalid username or password." });
    }
    if (!user.isVerified) {
      return res
        .status(401)
        .json({ ok: false, message: "Wait for account verification." });
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
    return res.status(200).json({ token, isAdmin: user.isAdmin });
  } catch (err) {
    return res.status(500).send("Server error");
  }
};

module.exports = { signup, login };
