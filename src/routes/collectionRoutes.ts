import express from "express";
import { fetchCollection } from "../controllers/collectionController";
import { validateCollectionParams } from "../middleware/collectionMiddleware";
import { apiRateLimit } from "../middleware/rateLimitMiddleware";
import { apiKeyAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/:username", apiRateLimit, apiKeyAuth, validateCollectionParams, fetchCollection);

export default router;