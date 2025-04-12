import express from "express";
import { fetchSearchData } from "../controllers/searchController";
import { validateSearchParams } from "../middleware/searchMiddleware";
import { apiRateLimit } from "../middleware/rateLimitMiddleware";
import { apiKeyAuth } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", apiRateLimit, apiKeyAuth, validateSearchParams, fetchSearchData);

export default router;