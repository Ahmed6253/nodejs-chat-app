import express from "express";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
const PORT = process.env.PORT;

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

app.use((err, req, res, next) => {
  if (err?.type === "entity.too.large") {
    return res.status(413).json({
      message: "File is too large. Please upload an image under 2MB.",
    });
  }
  next(err);
});

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);

app.listen(PORT, () => {
  console.log("server is running on " + PORT);
  connectDB();
});
