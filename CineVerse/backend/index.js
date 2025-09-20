// server.js
import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./utils/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from "cors";

// Load environment variables
dotenv.config({
  path: ".env"
});

// Initialize DB (serverless-friendly)
if (!global.dbConnection) {
  global.dbConnection = databaseConnection();
}

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://your-vercel-frontend-url.vercel.app" // replace with your frontend URL
      : "http://localhost:3000",
  credentials: true
};
app.use(cors(corsOptions));

// API Routes
app.use("/api/v1/user", userRoute);

// Root route (optional)
app.get("/", (req, res) => {
  res.send("✅ User Backend Running on Vercel 🚀");
});

// Export app for serverless deployment
export default app;

// Optional: Local development server
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`✅ Server running locally on port ${PORT}`);
  });
}
