// server.js
import express from "express";
import dotenv from "dotenv";
import databaseConnection from "./utils/database.js";
import cookieParser from "cookie-parser";
import userRoute from "./routes/userRoute.js";
import cors from "cors";

// Load environment variables
dotenv.config();

// Initialize DB (serverless-friendly)
if (!global.dbConnection) {
  global.dbConnection = databaseConnection();
}

const app = express();

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ✅ Vercel-friendly CORS configuration
const allowedOrigins = [
  "http://localhost:3000",                // local dev
  "https://cineverse-4.onrender.com",     // Render frontend
  "https://cineverse-4.vercel.app"        // Vercel frontend (if deployed here too)
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("❌ Not allowed by CORS: " + origin));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
};

app.use(cors(corsOptions));


// Handle preflight requests
app.options("*", cors());

// API Routes
app.use("/api/v1/user", userRoute);

// Root route
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
