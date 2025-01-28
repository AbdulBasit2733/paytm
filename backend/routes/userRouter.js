const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { z } = require("zod");
const { UserModel } = require("../db");
const AuthMiddleware = require("../middleware/middleware");

const router = express.Router();

router.post("/signup", async (req, res) => {
  // const session = await mongoose.startSession();

  // session.startTransaction();
  try {
    const { username, firstname, lastname, email, password } = req.body;
    console.log(req.body);

    const zodSchema = z.object({
      username: z
        .string()
        .min(3, { message: "username length must be geater than 3" })
        .max(30, { message: "username length must less than 30" }),
      firstname: z
        .string()
        .min(1, { message: "Fist Name length must be greater than 4" }),
      lastname: z
        .string()
        .min(1, { message: "Last Name length must be greater than 1" }),
      email: z.string().email({ message: "Invalid Email" }),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[\W_]/, "Password must contain at least one special character"),
    });

    const validationResult = zodSchema.safeParse({
      username,
      firstname,
      lastname,
      email,
      password,
    });

    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors.map(
        (err) => err.message
      );
      return res.status(300).json({
        success: false,
        message: errorMessages,
      });
    }

    const isUser = await UserModel.findOne({ email: email });

    if (isUser) {
      return res.status(300).json({
        success: false,
        message: "Email is already registered",
      });
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await UserModel.create({
      username,
      firstname,
      lastname,
      email,
      password: hashedPassword,
    });
    res.status(200).json({
      success: true,
      message: "Registered Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isUser = await UserModel.findOne({ email });

    if (!isUser) {
      return res.status(300).json({
        success: false,
        message: "Email Or Password is Incorrect !",
      });
    }
    const isMatchedPassword = await bcrypt.compare(password, isUser.password);
    if (!isMatchedPassword) {
      return res.status(300).json({
        success: false,
        message: "Email Or Password is Incorrect !",
      });
    }
    const token = jwt.sign(
      {
        id: isUser._id,
      },
      process.env.JWT_SECRET || "123321"
    );

    res
      .status(200)
      .cookie("token", token, {
        sameSite: true,
        secure: true,
      })
      .json({
        success: true,
        message: "LoggedIn Successfully",
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/all-users", (req, res) => {});

router.put("/update-profile", AuthMiddleware, async (req, res) => {
  try {
    const userId = req.userId;
    const { firstname, lastname, password } = req.body;
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      firstname,
      lastname,
      password: hashedPassword,
    });
    if (!updatedUser) {
      return res.status(300).json({
        success: false,
        message: "Updating Failed",
      });
    }
    res.status(200).json({
      success: false,
      message: "Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
