import express from "express";
import { protectRoute } from "../middleware/auth.js";
import {
  getUserforSidebar,
  getUserMessages,
  sendMessages,
} from "../controllers/message.js";

const router = express.Router();

router.get("/users", protectRoute, getUserforSidebar);
router.get("/:id", protectRoute, getUserMessages);

router.post("/send/:id", protectRoute, sendMessages);

export default router;
