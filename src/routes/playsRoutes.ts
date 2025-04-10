import express from "express";
import { fetchPlays, summaryPlays, winratePlays, dailyPlays } from "../controllers/playsController";
import { validatePlaysParams } from "../middleware/playsMiddleware";
import { apiRateLimit } from "../middleware/rateLimit";

const router = express.Router();

/**
 * @swagger
 * /api/plays/{id}:
 *   get:
 *     tags:
 *       - Plays
 *     summary: Get plays by boardgame ID
 *     description: Retrieve plays for a boardgame within a date range.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the board game.
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromdate
 *         required: false
 *         description: The start date for the plays (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: todate
 *         required: false
 *         description: The end date for the plays (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: A list of plays.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Play'
 *       400:
 *         description: Invalid parameters.
 */
router.get("/:id", apiRateLimit, validatePlaysParams, fetchPlays);

/**
 * @swagger
 * /api/plays/{id}/summary:
 *   get:
 *     tags:
 *       - Plays
 *     summary: Get summary of boardgame plays
 *     description: Compute plays summary of boardgame for the given time range.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the board game.
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromdate
 *         required: false
 *         description: The start date for the plays (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: todate
 *         required: false
 *         description: The end date for the plays (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: A summary of plays.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Summary'
 *       400:
 *         description: Invalid parameters.
 */
router.get("/:id/summary", apiRateLimit, validatePlaysParams, summaryPlays);

/**
 * @swagger
 * /api/plays/{id}/winrate:
 *   get:
 *     tags:
 *       - Plays
 *     summary: Get how many players have won in each game
 *     description: Retrieve the win rate of players for a specific board game within a date range.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the board game.
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromdate
 *         required: false
 *         description: The start date for the plays (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: todate
 *         required: false
 *         description: The end date for the plays (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Win rate of players.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/WinRate'
 *       400:
 *         description: Invalid parameters.
 */
router.get("/:id/winrate", apiRateLimit, validatePlaysParams, winratePlays);

/**
 * @swagger
 * /api/plays/{id}/daily:
 *   get:
 *     tags:
 *       - Plays
 *     summary: Get daily play statistics
 *     description: Retrieve daily statistics of plays for a specific board game within a date range.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the board game.
 *         schema:
 *           type: string
 *       - in: query
 *         name: fromdate
 *         required: false
 *         description: The start date for the plays (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: todate
 *         required: false
 *         description: The end date for the plays (YYYY-MM-DD).
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Daily play statistics.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/DailyStats'
 *       400:
 *         description: Invalid parameters.
 */
router.get("/:id/daily", apiRateLimit, validatePlaysParams, dailyPlays);

export default router;