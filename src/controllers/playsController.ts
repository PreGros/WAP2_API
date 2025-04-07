import { RequestHandler } from "express";
import { getPlaysById } from "../services/playsService";

export const fetchPlays: RequestHandler = async (req, res, next) => {
  const boardGameId = req.params.id;
  const fromDate = req.query.fromdate as string | undefined;
  const toDate = req.query.todate as string | undefined;

  try {
    const playsData = await getPlaysById(boardGameId, fromDate, toDate);
    res.type("application/xml").send(playsData);
  } catch (error) {
    next(error);
  }
};