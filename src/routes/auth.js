import express from "express";
import { signup, login, logout, UpdateProfile } from "../controllers/auth.js";
import { protectRoute } from "../middleware/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);
router.put("/update-profile", protectRoute, UpdateProfile);

export default router;
