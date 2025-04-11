import express from "express";
import { fetchboardgames } from "../controllers/boardgamesController";
import { validateBoardgameParams } from "../middleware/boardgameMiddleware";
import { apiRateLimit } from "../middleware/rateLimitMiddleware";
import { apiKeyAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:id", apiRateLimit, apiKeyAuth, validateBoardgameParams, fetchboardgames);

export default router;