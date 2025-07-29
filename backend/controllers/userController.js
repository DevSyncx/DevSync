import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import validator from "validator";
import jwt from "jsonwebtoken";

const userRegister = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.json({ success: false, message: "details are missing" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter valid Email Id" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter a strong Password" });
    }

    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res.json({
        success: false,
        message: "User Already exist please Login",
      });
    }

    const salt = await bcrypt.genSalt(10);

    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    await newUser.save();

    const token = await jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      message: "Registered successfully",
      token,
      username: user.name,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter valid Email" });
    }

    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.json({ success: false, message: "InValid Password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
      message: "LogIn successfull",
      username: user.name,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { userRegister, userLogin };
