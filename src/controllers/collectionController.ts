import { RequestHandler } from "express";
import { getCollection } from "../services/collectionService";

export const fetchCollection: RequestHandler = async (req, res, next) => {
    const username = req.params.username;

  try {
    const collectionData = await getCollection(username);
    res.json(collectionData);
  } catch (error) {
    next(error);
  }
};