import { RequestHandler } from "express";
import { getBoardgameById } from "../services/boardgameService";

export const fetchboardgames: RequestHandler = async (req, res, next) => {
  const boardGameId = req.params.id;

  try {
    const playsData = await getBoardgameById(boardGameId);
    res.json(playsData);
  } catch (error) {
    next(error);
  }
};