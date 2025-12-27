import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../lib/utiles.js";

export const signup = async (req, res) => {
  console.log("ahmed");

  const { fullName, email, password } = req.body;
  try {
    if (!password || !fullName || !email)
      return res.status(400).json({ message: "All fildes are required" });
    if (password.length < 6)
      return res
        .status(400)
        .json({ message: "Password has to be 6 characters or more" });

    const user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      return res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("error user create", error);
    return res
      .status(500)
      .json({ message: "Somthing went worng, please try again leater" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ messages: "invalid credentials" });
    }

    generateToken(user._id, res);
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("error in login controller:", error.message);
  }
};
export const logout = (req, res) => {
  res.send("logout route");
};
