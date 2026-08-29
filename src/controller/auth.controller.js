const userModel = require("../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

// POST /api/auth/register
async function userRegistercontroller(req, res) {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({
        message: "All fields (email, password, name) are required",
        status: "failed",
      });
    }

    const isExists = await userModel.findOne({ email });
    if (isExists) {
      return res.status(422).json({
        message: "User already exists",
        status: "failed",
      });
    }

    const user = await userModel.create({
      email,
      password: String(password),
      name,
    });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    // Set secure cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    
    await emailService.sendRegsitrationEmail(user.email, user.name);

    return res.status(201).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "failed",
    });
  }
}

// POST /api/auth/login
async function userLogincontroller(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
        status: "failed",
      });
    }

    const user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
        status: "failed",
      });
    }

    const isValidPassword = await user.comparePassword(String(password));
    if (!isValidPassword) {
      return res.status(401).json({
        message: "Invalid email or password",
        status: "failed",
      });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "3d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return res.status(200).json({
      user: {
        _id: user._id,
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Internal server error",
      status: "failed",
    });
  }
}








module.exports = {
  userRegistercontroller,
  userLogincontroller,
};