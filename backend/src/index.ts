import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/auth.routes";
import profileRoutes from "./routes/profile.routes";
import projectRoutes from "./routes/project.routes";
import experienceRoutes from "./routes/experience.routes";
import educationRoutes from "./routes/education.routes";
import skillRoutes from "./routes/skill.routes";
import blogRoutes from "./routes/blog.routes";
import messageRoutes from "./routes/message.routes";
import socialRoutes from "./routes/social.routes";
import settingRoutes from "./routes/setting.routes";
import uploadRoutes from "./routes/upload.routes";
import { errorHandler } from "./middleware/error.middleware";

export const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
// CORS: support comma-separated list in CORS_ORIGIN env var (e.g. "https://a.com,https://b.com")
const rawCors = process.env.CORS_ORIGIN || "http://localhost:3000";
const allowedOrigins = rawCors
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean)
  .map((s) => s.replace(/\/+$/, "")); // strip trailing slashes

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow non-browser requests (e.g., server-to-server)
      if (!origin) return callback(null, true);
      // Allow if origin is in list or wildcard present
      if (allowedOrigins.includes("*") || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      console.warn("Blocked CORS origin:", origin);
      return callback(null, false);
    },
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api", limiter);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Static files (uploaded images)
app.use("/uploads", express.static("uploads"));

// Health check
app.get("/health", (_, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/experiences", experienceRoutes);
app.use("/api/education", educationRoutes);
app.use("/api/skills", skillRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/social", socialRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/upload", uploadRoutes);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({ success: false, message: `Route ${req.path} not found` });
});

// Error handler
app.use(errorHandler);

// Start server when not running in Vercel (serverless) environment
async function main() {
  try {
    await prisma.$connect();
    console.log("✅ Database connected");

    // Vercel and other serverless platforms import this module and expect a default
    // export (function or server). They do not expect the app to call `listen()`.
    // Only start a listener when running locally or in a non-serverless environment.
    if (!process.env.VERCEL) {
      app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      });
    } else {
      console.log(
        "ℹ️ Running in serverless mode (Vercel) — skipping app.listen()",
      );
    }
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    if (!process.env.VERCEL) process.exit(1);
  }
}

// Only run main automatically in non-serverless environments
if (!process.env.VERCEL) {
  main();
}

// In serverless environments (Vercel), export a request handler function as default.
// Ensure Prisma is connected once per runtime (avoid reconnecting on every invocation).
const ensurePrismaConnected = async () => {
  const g = global as any;
  if (!g.__prismaConnected) {
    try {
      await prisma.$connect();
      g.__prismaConnected = true;
      console.log("✅ Prisma connected (serverless)");
    } catch (err) {
      console.error("❌ Prisma connect error (serverless):", err);
      throw err;
    }
  }
};

export default async function handler(req: any, res: any) {
  // Connect Prisma on cold start if needed, then forward to the Express app
  try {
    await ensurePrismaConnected();
  } catch (err) {
    // If Prisma can't connect, return 500
    try {
      res.statusCode = 500;
      res.setHeader("content-type", "application/json");
      res.end(
        JSON.stringify({
          success: false,
          message: "Database connection error",
        }),
      );
      return;
    } catch (e) {
      console.error(e);
    }
  }

  return app(req, res);
}

// Graceful shutdown
process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});
