import { RequestHandler } from "express";
import { getCollection, filterCollection } from "../services/collectionService";

export const fetchCollection: RequestHandler = async (req, res, next) => {
    const username = req.params.username;
    const displayArgs = req.query.display as string | undefined;

  try {
    const collectionData = await getCollection(username);
    const filteredCollectionData = await filterCollection(collectionData, displayArgs);
    res.json(filteredCollectionData);
  } catch (error) {
    next(error);
  }
};