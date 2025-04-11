import express from "express";
import { fetchBoardgames, boardgameSoloRef, boardgamePublisher, boardgameMarketplace } from "../controllers/boardgamesController";
import { validateBoardgameParams } from "../middleware/boardgameMiddleware";
import { apiRateLimit } from "../middleware/rateLimitMiddleware";
import { apiKeyAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:id", apiRateLimit, apiKeyAuth, validateBoardgameParams, fetchBoardgames);
router.get("/:id/soloRef", apiRateLimit, apiKeyAuth, validateBoardgameParams, boardgameSoloRef);
router.get("/:id/publishers", apiRateLimit, apiKeyAuth, validateBoardgameParams, boardgamePublisher);
router.get("/:id/marketplace", apiRateLimit, apiKeyAuth, validateBoardgameParams, boardgameMarketplace);

export default router;