import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import { connectDB } from "@/config/db";
import { env } from "@/config/env";
import { errorHandler } from "@/middleware/errorHandler";
import { tenantMiddleware } from "@/middleware/tenant";
import { auditLog } from "@/middleware/audit";
import routes from "@/routes";

dotenv.config();

const app = express();
const httpServer = createServer(app);

/* =============================
   ALLOWED ORIGINS (FIXED)
============================= */
const allowedOrigins = [
  "http://localhost:3000",
  "https://otpmarket-six.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

/* =============================
   SOCKET.IO CONFIG
============================= */
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

app.set("io", io);

/* =============================
   SECURITY MIDDLEWARES
============================= */
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(compression());
app.use(mongoSanitize());

/* =============================
   CORS (PRODUCTION SAFE FIX)
============================= */
app.use(
  cors({
    origin: function (origin, callback) {
      // allow server-to-server or Postman
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin) || origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ✅ IMPORTANT: Preflight support */
app.options("*", cors());

/* =============================
   BASIC MIDDLEWARES
============================= */
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/* =============================
   RATE LIMITER
============================= */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});

app.use("/api", limiter);

/* =============================
   CUSTOM MIDDLEWARES
============================= */
app.use(tenantMiddleware);
app.use(auditLog("api_request", "api"));

/* =============================
   ROOT ROUTE
============================= */
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "OTPMarket Backend is running successfully",
    version: "1.0.0",
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

/* =============================
   HEALTH CHECK
============================= */
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

/* =============================
   API ROUTES
============================= */
app.use("/api/v1", routes);

/* =============================
   ERROR HANDLER
============================= */
app.use(errorHandler);

/* =============================
   SOCKET EVENTS
============================= */
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("join:chat", (chatId: string) => {
    socket.join(`chat:${chatId}`);
  });

  socket.on("leave:chat", (chatId: string) => {
    socket.leave(`chat:${chatId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

/* =============================
   START SERVER
============================= */
const startServer = async () => {
  try {
    await connectDB();

    const PORT = env.PORT || 5000;

    httpServer.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
};

startServer();

export { app, httpServer, io };