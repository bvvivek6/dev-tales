import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import postRoutes from "./routes/posts.js";
import adminRoutes from "./routes/admin.js";
import commentRoutes from "./routes/comments.js";
import uploadRoutes from "./routes/upload.js";
import authRoutes from "./routes/auth.js";
import { protect, admin } from "./middleware/authMiddleware.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5173" }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Public API routes
app.use("/api/posts", postRoutes);
app.use("/api/posts", commentRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/auth", authRoutes);

// Admin API routes
app.use("/api/admin", protect, admin, adminRoutes);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Connect to DB and start server
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});
