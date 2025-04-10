import express from "express";
// import dotenv from "dotenv";
import playsRoutes from "./routes/playsRoutes";
import { errorHandler } from "./utils/errorHandler";
import { apiRateLimit } from "./middleware/rateLimit";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "./swaggerConfig";

// Load environment variables from .env file
// dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const swaggerSpec = swaggerJSDoc(swaggerOptions);

// Middleware to parse incoming requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to all routes
app.use(apiRateLimit);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Register routes
app.use("/api/plays", playsRoutes);

// Error handling middleware
app.use(errorHandler);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});