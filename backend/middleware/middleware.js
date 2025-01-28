const jwt = require("jsonwebtoken");
const { UserModel } = require("../db");

const AuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(300).json({
        success: false,
        message: "Token has expired or Not found",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET || "123321");
    if (decodedData.id) {
      req.userId = decodedData.id;
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Token has been expired",
      });
    }
  } catch (error) {
    console.log(error);
    res.status("Internal Server Error");
  }
};

module.exports = AuthMiddleware
