import express from "express";
import { fetchBoardgames, boardgameSoloRef, boardgamePublisher, boardgameMarketplace } from "../controllers/boardgamesController";
import { validateBoardgameParams } from "../middleware/boardgameMiddleware";
import { apiRateLimit } from "../middleware/rateLimitMiddleware";
import { apiKeyAuth } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/boardgames/{id}:
 *   get:
 *     tags:
 *       - Boardgames
 *     summary: Get boardgame details by ID
 *     description: Retrieve detailed information about a specific boardgame by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the boardgame.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Boardgame details.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Boardgame'
 *       400:
 *         description: Invalid parameters.
 *       404:
 *         description: Boardgame not found.
 */
router.get("/:id", apiRateLimit, apiKeyAuth, validateBoardgameParams, fetchBoardgames);

/**
 * @swagger
 * /api/boardgames/{id}/soloRef:
 *   get:
 *     tags:
 *       - Boardgames
 *     summary: Get solo reference for a boardgame
 *     description: Retrieve the solo play recommendations for a specific boardgame.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the boardgame.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Solo play recommendations.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SoloRef'
 *       400:
 *         description: Invalid parameters.
 *       404:
 *         description: Boardgame not found.
 */
router.get("/:id/soloRef", apiRateLimit, apiKeyAuth, validateBoardgameParams, boardgameSoloRef);

/**
 * @swagger
 * /api/boardgames/{id}/publishers:
 *   get:
 *     tags:
 *       - Boardgames
 *     summary: Get publishers of a boardgame
 *     description: Retrieve the list of publishers for a specific boardgame.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the boardgame.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of publishers.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PublishersResponse'
 *       400:
 *         description: Invalid parameters.
 *       404:
 *         description: Boardgame not found.
 */
router.get("/:id/publishers", apiRateLimit, apiKeyAuth, validateBoardgameParams, boardgamePublisher);

/**
 * @swagger
 * /api/boardgames/{id}/marketplace:
 *   get:
 *     tags:
 *       - Boardgames
 *     summary: Get marketplace listings for a boardgame
 *     description: Retrieve marketplace listings for a specific boardgame, with optional filters.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the boardgame.
 *         schema:
 *           type: string
 *       - in: query
 *         name: currency
 *         required: false
 *         description: Filter listings by currency (e.g., USD, EUR).
 *         schema:
 *           type: string
 *       - in: query
 *         name: sort
 *         required: false
 *         description: Sort listings by price (ascending or descending).
 *         schema:
 *           type: string
 *           enum: [ascending, descending]
 *       - in: query
 *         name: fromdate
 *         required: false
 *         description: Filter listings from a specific date (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: todate
 *         required: false
 *         description: Filter listings up to a specific date (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Marketplace listings.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MarketplaceResponse'
 *       400:
 *         description: Invalid parameters.
 *       404:
 *         description: Boardgame not found.
 */
router.get("/:id/marketplace", apiRateLimit, apiKeyAuth, validateBoardgameParams, boardgameMarketplace);

export default router;