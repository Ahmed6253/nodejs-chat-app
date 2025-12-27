import express from "express";
import { signup, login, logout } from "../controllers/auth.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.delete("/logout", logout);

export default router;
