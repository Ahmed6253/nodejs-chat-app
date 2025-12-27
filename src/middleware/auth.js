import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const protectRoute = async (req, res, next) => {
  try {
    const cookie = req.cookies.jwt;
    if (!cookie) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No Token Provided" });
    }
    const decoded = jwt.verify(cookie, process.env.JWT_SECRET);
    if (!decoded) {
      return res
        .status(401)
        .json({ message: "Unauthorized - Token Is Invalid" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    req.user = user;

    next();
  } catch (error) {
    console.log("error in the auth route protect middleware", error);
    res.status(500).json({ message: "Internal serve error" });
  }
};
