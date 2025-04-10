import express from "express";
import { fetchPlays, summaryPlays, winratePlays, dailyPlays } from "../controllers/playsController";
import { validatePlaysParams } from "../middleware/playsMiddleware";
import { apiRateLimit } from "../middleware/rateLimit";

const router = express.Router();

// Apply the middleware and controller to the route
router.get("/:id", apiRateLimit, validatePlaysParams, fetchPlays);
router.get("/:id/summary", apiRateLimit, validatePlaysParams, summaryPlays);
router.get("/:id/winrate", apiRateLimit, validatePlaysParams, winratePlays);
router.get("/:id/daily", apiRateLimit, validatePlaysParams, dailyPlays);

export default router;