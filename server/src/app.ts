import express from "express";
import campaignRoutes from "./routes/campaign.routes.js";
import emailRoutes from "./routes/email.routes.js";
import recipientRoutes from "./routes/recipient.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";

const app = express();

app.use(express.json());

app.use("/api/campaigns", campaignRoutes);
app.use("/api/emails", emailRoutes);
app.use("/api/recipients", recipientRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "MailFlow server is healthy",
  });
});

export default app;