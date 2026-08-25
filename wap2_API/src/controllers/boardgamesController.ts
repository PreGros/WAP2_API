import { RequestHandler } from "express";
import { getBoardgameById, getSoloRef, getPublishers, getBoardgameMarketplace } from "../services/boardgameService";

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

export const boardgameMarketplace: RequestHandler = async (req, res, next) => {
  const boardGameId = req.params.id;
  const currency = req.query.currency as string | undefined;
  const sort = req.query.sort as string | undefined;
  const fromDate = req.query.fromdate as string | undefined;
  const toDate = req.query.todate as string | undefined;

  try {
    const playsData = await getBoardgameById(boardGameId);
    const marketplaceData = await getBoardgameMarketplace(playsData, currency, sort, fromDate, toDate);
    res.json(marketplaceData);
  } catch (error) {
    next(error);
  }
};