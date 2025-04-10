import express from "express";
import { fetchPlays, summaryPlays, winratePlays, dailyPlays } from "../controllers/playsController";
import { validatePlaysParams } from "../middleware/playsMiddleware";

const router = express.Router();

// Apply the middleware and controller to the route
router.get("/:id", validatePlaysParams, fetchPlays);
router.get("/:id/summary", validatePlaysParams, summaryPlays);
router.get("/:id/winrate", validatePlaysParams, winratePlays);
router.get("/:id/daily", validatePlaysParams, dailyPlays);

export default router;