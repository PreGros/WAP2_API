import express from "express";
import { fetchPlays } from "../controllers/playsController";
import { validatePlaysParams } from "../middleware/playsMiddleware";

const router = express.Router();

// Apply the middleware and controller to the route
router.get("/:id", validatePlaysParams, fetchPlays);

export default router;