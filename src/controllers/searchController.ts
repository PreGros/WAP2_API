import { RequestHandler } from "express";
import { getSearchData, filterData } from "../services/searchService";

export const fetchSearchData: RequestHandler = async (req, res, next) => {
  const searchQuery = req.query.query as string
  const fromDate = req.query.fromdate as string | undefined;
  const toDate = req.query.todate as string | undefined;
  const exact = req.query.exact as string | undefined;
  const type = req.query.type as string | undefined;

  try {
    const playsData = await getSearchData(searchQuery, exact);
    const filteredData = await filterData(playsData, fromDate, toDate, type);
    res.json(filteredData);
  } catch (error) {
    next(error);
  }
};