import app from "./app.js";
import { prisma } from "./prisma.js";
import { redis } from "./redis.js";
import "./worker.js";
const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await prisma.$connect();
    console.log("Database connected successfully");
    await redis.ping();
    console.log("Redis connected successfully");
    app.listen(PORT, () => {
      console.log(`MailFlow server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
}

startServer();