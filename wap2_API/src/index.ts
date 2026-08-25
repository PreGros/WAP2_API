import express from "express";
import dotenv from "dotenv";
import playsRoutes from "./routes/playsRoutes";
import boardgamesRoutes from "./routes/boardgamesRoutes";
import searchRoutes from "./routes/searchRoutes";
import collectionRoutes from "./routes/collectionRoutes"
import { errorHandler } from "./utils/errorHandler";
import { apiRateLimit } from "./middleware/rateLimitMiddleware";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerOptions from "./swaggerConfig";
import { apiKeyAuth } from "./middleware/authMiddleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const swaggerSpec = swaggerJSDoc(swaggerOptions);
const cors = require('cors');

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(apiRateLimit);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(apiKeyAuth);

app.use("/api/plays", playsRoutes);
app.use("/api/boardgames", boardgamesRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/collection", collectionRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});