const jwt = require("jsonwebtoken");
const { UserModel, AccountModel } = require("../db");

const AuthMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not found or expired",
      });
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET || "123321");

    if (decodedData.id) {
      const user = await AccountModel.findOne({ userId: decodedData.id }).populate("userId", "-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = user;
      next();
    } else {
      return res.status(403).json({
        success: false,
        message: "Invalid token",
      });
    }
  } catch (error) {
    console.error(error);
    // Improved error handling with status code 500 for internal server error
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message, // Optionally include the error message for debugging
    });
  }
};

module.exports = AuthMiddleware;
