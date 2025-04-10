import express from "express";
// import dotenv from "dotenv";
import playsRoutes from "./routes/playsRoutes";
import { errorHandler } from "./utils/errorHandler";
import { apiRateLimit } from "./middleware/rateLimit";

// Load environment variables from .env file
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to all routes
app.use(apiRateLimit);

// Register routes
app.use("/api/plays", playsRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});