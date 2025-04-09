import express from "express";
import { fetchPlays, summaryPlays, winratePlays } from "../controllers/playsController";
import { validatePlaysParams } from "../middleware/playsMiddleware";

const router = express.Router();

// Apply the middleware and controller to the route
router.get("/:id", validatePlaysParams, fetchPlays);
router.get("/:id/summary", validatePlaysParams, summaryPlays);
router.get("/:id/winrate", validatePlaysParams, winratePlays)

export default router;