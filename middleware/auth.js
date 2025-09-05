const jwt = require("jsonwebtoken");
const Admin = require("../models/admin");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer", "").trim();
    if (!token) {
      res.status(401).json({
        success: false,
        message: "Access denied. No token provided.",
      });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.id).select("-password");
    if (!admin) {
      res.status(401).json({
        success: false,
        message: "Access denied. Invalid token.",
      });
    }

    req.admin = admin
    next()
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Access denied. Invalid token.",
    });
  }
};

module.exports = auth;
