import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { Boardgame } from "../models/boardgame";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 });

const fetchboardGame = async (id: string) => {
    const response = await axios.get('https://boardgamegeek.com/xmlapi2/thing', {
      params: {
          id: id
      }
    });
  
    const parser = new XMLParser({ ignoreAttributes: false });
    return parser.parse(response.data);
  };

export const getBoardgameById = async (id: string): Promise<Boardgame> => {
    const cacheKey = `${id}`;
    const cachedData = cache.get<Boardgame>(cacheKey);

    if (cachedData) {
    console.log("Boardgame cache hit");
    return cachedData;
    }

    let foundBoardGame: Boardgame = {maxPlayers: "", bestWith: ""};
    try {
        const parsedData = await fetchboardGame(id);
        foundBoardGame.bestWith = parsedData.items.item["poll-summary"].result[0]["@_value"];
        foundBoardGame.maxPlayers = parsedData.items.item.maxplayers["@_value"];
    } catch (error) {
        throw error;
    }

    
    // Cache the result
    cache.set(cacheKey, foundBoardGame)

    return foundBoardGame;
}