const jwt = require("jsonwebtoken");

const verifyJWT = (req, res, next) =>{
  const token = req.headers.authorization?.split(" ")[1];
  return res.status(401).json({ok:false,message:"Unauthorized"});
}
try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch (err) {
  return res.status(401).json({ok:false,message:"Invalid token"});
}}

module.exports = { verifyJWT };
