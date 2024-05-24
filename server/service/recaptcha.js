require("dotenv").config();
const axios = require("axios");
const verifyRecaptcha = async (token) => {
  const secretKey = process.env.CAPTCHA_SECRET;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`;

  try {
    const response = await axios.post(url);
    return response.data.success;
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error);
    return false;
  }
};
module.exports = { verifyRecaptcha };
