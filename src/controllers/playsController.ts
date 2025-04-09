import { RequestHandler } from "express";
import { getPlaysById, getPlaysSummary, getPlaysWinrate } from "../services/playsService";

export const fetchPlays: RequestHandler = async (req, res, next) => {
  const boardGameId = req.params.id;
  const fromDate = req.query.fromdate as string | undefined;
  const toDate = req.query.todate as string | undefined;

  try {
    const playsData = await getPlaysById(boardGameId, fromDate, toDate);
    res.json(playsData);
  } catch (error) {
    next(error);
  }
};

export const summaryPlays: RequestHandler = async (req, res, next) => {
  const boardGameId = req.params.id;
  const fromDate = req.query.fromdate as string | undefined;
  const toDate = req.query.todate as string | undefined;

  try {
    const playsData = await getPlaysById(boardGameId, fromDate, toDate);
    const playsSummary = await getPlaysSummary(playsData, fromDate, toDate);
    res.json(playsSummary);
  } catch (error) {
    next(error);
  }
}

export const winratePlays: RequestHandler = async (req, res, next) => {
  const boardGameId = req.params.id;
  const fromDate = req.query.fromdate as string | undefined;
  const toDate = req.query.todate as string | undefined;

  try {
    const playsData = await getPlaysById(boardGameId, fromDate, toDate);
    const playsWinrate = await getPlaysWinrate(playsData, boardGameId);
    res.json(playsWinrate);
  } catch (error) {
    next(error);
  }
}