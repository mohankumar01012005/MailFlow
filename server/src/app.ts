import express from "express";
import campaignRoutes from "./routes/campaign.routes.js";
import emailRoutes from "./routes/email.routes.js";
import recipientRoutes from "./routes/recipient.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import senderRoutes from "./routes/sender.routes.js";
import authRoutes from "./routes/auth.routes.js";
import { securityHeadersMiddleware } from "./middleware/security.js";
import { globalApiLimiter } from "./middleware/rate-limiter.js";
import { authMiddleware } from "./middleware/auth.middleware.js";
import cors from 'cors';

const app = express();
app.set("trust proxy", 1);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
].filter(Boolean) as string[];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin) || allowedOrigins.some((allowed) => origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      callback(null, true);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(securityHeadersMiddleware);
app.use("/api", globalApiLimiter);
app.use(express.json());

// Public routes
app.use("/api/auth", authRoutes);

// Protected routes (require valid JWT Bearer token)
app.use("/api/campaigns", authMiddleware, campaignRoutes);
app.use("/api/emails", authMiddleware, emailRoutes);
app.use("/api/recipients", authMiddleware, recipientRoutes);
app.use("/api/dashboard", authMiddleware, dashboardRoutes);
app.use("/api/settings", authMiddleware, settingsRoutes);
app.use("/api/senders", authMiddleware, senderRoutes);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "MailFlow server is healthy",
  });
});

export default app;