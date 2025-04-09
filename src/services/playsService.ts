import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { Play } from "../models/play";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const parsePlays = (playObjects: any): Play[] => {
  return playObjects.map((play: any) => ({
    id: play["@_id"],
    date: new Date(play["@_date"]),
    length: parseInt(play["@_length"], 10),
    players: Array.isArray(play.players?.player)
      ? play.players.player.map((player: any) => ({
          userid: player["@_userid"],
          name: player["@_name"],
          win: player["@_win"],
        }))
      : [],
  }));
};

const fetchPlaysPage = async (id: string, formattedFromDate: string, formattedToDate: string, page: number) => {
  const response = await axios.get('https://boardgamegeek.com/xmlapi2/plays', {
    params: {
        id: id,
        mindate: formattedFromDate,
        maxdate: formattedToDate,
        page: page
    }
  });

  const parser = new XMLParser({ ignoreAttributes: false });
  return parser.parse(response.data);
};

export const getPlaysById = async (id: string, fromDate: string | undefined, toDate: string | undefined): Promise<Play[]> => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedFromDate = fromDate ?? yesterday.toISOString().split("T")[0]; // Default to yesterday's date
  const formattedToDate = toDate ?? today.toISOString().split("T")[0]; // Default to today's date

  const cacheKey = `${id}_${fromDate}_${toDate}`;
  const cachedData = cache.get<Play[]>(cacheKey);

  if (cachedData) {
    console.log("Cache hit");
    return cachedData;
  }

  let pageCount = -1;
  let page = 1;
  let allPlays: Play[] = [];

  try {
    while (page <= pageCount || pageCount == -1) {
      try { // double re-try process cuz source API rate limit recover
        const parsedData = await fetchPlaysPage(id, formattedFromDate, formattedToDate, page);
        page++;

        if (pageCount == -1) { // Repeat request logic, first time check for content and set correct pagecount if there is any
          const totalContent = parseInt(parsedData.plays?.["@_total"], 10);
          pageCount = Math.ceil(totalContent / 100);
          if (pageCount == 0) {
            const err = new Error("Fetch data failed");
            (err as any).statusCode = 400;
            (err as any).details = "No data found with given parameters.";
            throw err;
          }
        }

        const playObjects = parsedData.plays?.play; // array of play

        allPlays = allPlays.concat(parsePlays(playObjects));

      } catch (error: any) { // source API rate limit error handling
        if (error.response?.status === 429) {
          console.warn("Source API rate limit hit. Retrying after delay...");
          await sleep(10000);
          continue; 
        } else {
          throw error;
        }
      }
    }

    // Cache the result
    cache.set(cacheKey, allPlays)

    let counter = 0;

    // allPlays.forEach(play => {
    //   if (play.players && play.players.length > 0) {
    //     counter++;
    //   }
    // });
    // console.log(counter);
    console.log(allPlays)

    return allPlays;

  }catch (error: any) {
    throw error; 
  }
};