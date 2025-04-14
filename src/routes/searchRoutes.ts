import express from "express";
import { fetchSearchData } from "../controllers/searchController";
import { validateSearchParams } from "../middleware/searchMiddleware";
import { apiRateLimit } from "../middleware/rateLimitMiddleware";
import { apiKeyAuth } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/search:
 *   get:
 *     tags:
 *       - Search
 *     summary: Search for boardgames, RPGs, or video games
 *     description: Retrieve a list of items matching the search query with optional filters.
 *     parameters:
 *       - in: query
 *         name: query
 *         required: true
 *         description: The search query string.
 *         schema:
 *           type: string
 *       - in: query
 *         name: exact
 *         required: false
 *         description: Whether to perform an exact match (1 for true, 0 for false).
 *         schema:
 *           type: string
 *           enum: [1, 0]
 *       - in: query
 *         name: fromdate
 *         required: false
 *         description: Filter results from a specific year (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: todate
 *         required: false
 *         description: Filter results up to a specific year (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: type
 *         required: false
 *         description: Filter results by type (e.g., boardgame, rpg, videogame).
 *         schema:
 *           type: string
 *           enum: [boardgame, boardgameexpansion, rpg, rpgitem, videogame]
 *     responses:
 *       200:
 *         description: A list of search results.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/SearchData'
 *       400:
 *         description: Invalid parameters.
 */
router.get("/", apiRateLimit, apiKeyAuth, validateSearchParams, fetchSearchData);

export default router;