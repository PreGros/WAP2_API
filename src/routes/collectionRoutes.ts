import express from "express";
import { fetchCollection } from "../controllers/collectionController";
import { validateCollectionParams } from "../middleware/collectionMiddleware";
import { apiRateLimit } from "../middleware/rateLimitMiddleware";
import { apiKeyAuth } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /api/collection/{username}:
 *   get:
 *     tags:
 *       - Collection
 *     summary: Get user collection
 *     description: Retrieve the collection of a user by their username, with optional filters.
 *     parameters:
 *       - in: path
 *         name: username
 *         required: true
 *         description: The username of the user whose collection is being retrieved.
 *         schema:
 *           type: string
 *       - in: query
 *         name: display
 *         required: false
 *         description: Filter collection items by status (e.g., own=1,wishlist=0).
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A user's collection.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserCollection'
 *       400:
 *         description: Invalid parameters.
 *       404:
 *         description: Collection not found.
 */
router.get("/:username", apiRateLimit, apiKeyAuth, validateCollectionParams, fetchCollection);

export default router;