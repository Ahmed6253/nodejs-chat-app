import express from "express";
import authRoutes from "./routes/auth.js";
import messageRoutes from "./routes/message.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { app, server } from "./lib/socket.js";
import path from "path";
import dns from "dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const __dirname = path.resolve();

dotenv.config();
const PORT = process.env.PORT;

app.set("etag", false);

app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "5mb", extended: true }));
app.use(cors({ origin: process.env.FRONT_BASE_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(
    express.static(path.join(__dirname, "../nodejs-chat-app-front/dist")),
  );
  app.get("*", (req, res) => {
    res.sendFile(
      path.join(__dirname, "../nodejs-chat-app-front", "dist", "index.html"),
    );
  });
}

server.listen(PORT, () => {
  console.log("server is running on " + PORT);
  connectDB();
});
