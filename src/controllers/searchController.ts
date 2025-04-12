import { RequestHandler } from "express";
import { getSearchData } from "../services/searchService";

export const fetchSearchData: RequestHandler = async (req, res, next) => {
  const searchQuery = req.query.query as string
  const fromDate = req.query.fromdate as string | undefined;
  const toDate = req.query.todate as string | undefined;
  const exact = req.query.exact as string | undefined;

  try {
    const playsData = await getSearchData(searchQuery, fromDate, toDate, exact);
    res.json(playsData);
  } catch (error) {
    next(error);
  }
};