import { RequestHandler } from "express";
import { getBoardgameById, getSoloRef, getPublishers } from "../services/boardgameService";

export const fetchBoardgames: RequestHandler = async (req, res, next) => {
  const boardGameId = req.params.id;

  try {
    const playsData = await getBoardgameById(boardGameId);
    res.json(playsData);
  } catch (error) {
    next(error);
  }
};


export const boardgameSoloRef: RequestHandler = async (req, res, next) => {
  const boardGameId = req.params.id;

  try {
    const playsData = await getBoardgameById(boardGameId);
    const soloRef = await getSoloRef(playsData);
    res.json(soloRef);
  } catch (error) {
    next(error);
  }
};

export const boardgamePublisher: RequestHandler = async (req, res, next) => {
  const boardGameId = req.params.id;

  try {
    const playsData = await getBoardgameById(boardGameId);
    const publishersData = await getPublishers(playsData);
    res.json(publishersData);
  } catch (error) {
    next(error);
  }
};