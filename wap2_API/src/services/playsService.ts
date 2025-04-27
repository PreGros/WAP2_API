import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { Play } from "../models/play";
import { Boardgame } from "../models/boardgame";
import { getBoardgameById } from "../services/boardgameService";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// parsing each play and its players
const parsePlays = (playObjects: any): Play[] => {
  return playObjects.map((play: any) => ({
    id: play["@_id"] ?? "",
    date: play["@_date"] ? new Date(play["@_date"]).toISOString().split("T")[0] : new Date(-8640000000000000).toISOString().split("T")[0],
    length: parseInt(play["@_length"] ?? "0", 10),
    comments: play.comments ?? "",
    players: Array.isArray(play.players?.player)
            ? play.players.player.map((player: any) => ({
                userid: player["@_userid"] ?? "",
                name: player["@_name"] ?? "",
                win: player["@_win"] ?? false,
              }))
            : [],
  }));
};

// today and yesterdays date in right format if arguments are absent
const getDefaultDates = (fromDate: string | undefined, toDate: string | undefined) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  return {
    formattedFromDate: fromDate ?? yesterday.toISOString().split("T")[0],
    formattedToDate: toDate ?? today.toISOString().split("T")[0],
  };
};

// fetching data from source API and parsing them
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

// main fetching function, contating each data batch to results (parsing them beforehand)
export const getPlaysById = async (id: string, fromDate: string | undefined, toDate: string | undefined): Promise<Play[]> => {
  const { formattedFromDate, formattedToDate } = getDefaultDates(fromDate, toDate);

  const cacheKey = `${id}_${formattedFromDate}_${formattedToDate}`;
  const cachedData = cache.get<Play[]>(cacheKey);

  if (cachedData) {
    return cachedData;
  }

  let pageCount = -1;
  let page = 1;
  let allPlays: Play[] = [];

  while (page <= pageCount || pageCount == -1) {
    try {
      const parsedData = await fetchPlaysPage(id, formattedFromDate, formattedToDate, page);
      page++;

      if (pageCount == -1) { // repeat request logic, first time check for content and set correct pagecount if there is any
        const totalContent = parseInt(parsedData.plays?.["@_total"] ?? "0", 10);
        pageCount = Math.ceil(totalContent / 100);
        if (pageCount == 0) {
          cache.set(cacheKey, allPlays);
          return allPlays;
        }
      }

      const playObjects = parsedData.plays?.play;

      if (playObjects) {
        allPlays = allPlays.concat(parsePlays(playObjects));
      }

    } catch (error) { // source API rate limit error handling
      if (axios.isAxiosError(error) && error.response?.status === 429) {
        const retryAfter = 10;
        // console.warn(`Source API rate limit hit. Retrying after ${retryAfter} seconds...`);
        await sleep(retryAfter * 1000);
        continue; 
      } else {
        throw error;
      }
    }
  }

  // Cache the result
  cache.set(cacheKey, allPlays)

  return allPlays;
};

// create summary of fetched plays
export const getPlaysSummary = async (loadedPlays: Play[], fromDate: string | undefined, toDate: string | undefined) => {
  const { formattedFromDate, formattedToDate } = getDefaultDates(fromDate, toDate);

  const totalPlays = loadedPlays.length;

  const nonZeroTimePlays = loadedPlays.filter(play => play.length && play.length > 0);
  const lengthsArray = nonZeroTimePlays.map(play => play.length);
  const totalPlayTime = nonZeroTimePlays.reduce((sum, play) => sum + play.length, 0);
  const playTimeStats = {
    totalPlayTime,
    nonZeroPlayCount: nonZeroTimePlays.length,
    maxPlayTime: loadedPlays.length ? Math.max(...lengthsArray) : 0, // ... spreads each element of an array as arguments to function
    minPlayTime: loadedPlays.length ? Math.min(...lengthsArray) : 0,
    averagePlayTime: nonZeroTimePlays.length > 0 ? totalPlayTime / nonZeroTimePlays.length : 0,
  };
  
  // set because it stores only unique values
  // map transform player to only userid
  // flatMap apply map on each player and create one array from each player in each play
  const uniquePlayers = new Set(
    loadedPlays.flatMap(play => (play.players ?? []).map(player => player.userid))
  ).size;

  const dateRange = {
    from: formattedFromDate,
    to: formattedToDate,
  };

  return {
    totalPlays,
    playTimeStats,
    uniquePlayers,
    dateRange,
  };
};

// get winrate for each player win count
export const getPlaysWinrate = async (loadedPlays: Play[], id: string) => {
  const playedBoardgame: Boardgame = await getBoardgameById(id);
  const maxNumPlayers = parseInt(playedBoardgame.maxPlayers, 10);

  // init Record with number of elems = max number of players for given boardgame
  const winCounts: Record<string, number> = {};
  for (let i = 0; i <= maxNumPlayers; i++) {
    winCounts[`${i}playerwinrate`] = 0;
  }

  // increment for each play how many players won
  const playersRecorded = loadedPlays.filter((play) => play.players && play.players.length > 0);
  playersRecorded.forEach((play) => {
    const winners = play.players?.filter((player) => player.win == true) || [];
    const numWinners = winners.length;

    if (numWinners >= 0 && numWinners <= maxNumPlayers) {
      winCounts[`${numWinners}playerwinrate`] += 1;
    }
  });

  const playersRecordedLen = playersRecorded.length;
  return {
    playersRecordedLen,
    winCounts,
  };
}

// computing how many plays were recorded for each day in the time range
export const getPlaysDaily = async (loadedPlays: Play[], fromDate: string | undefined, toDate: string | undefined) => {
  const { formattedFromDate, formattedToDate } = getDefaultDates(fromDate, toDate);

  const dailyPlayCount: Record<string, number> = {};
  const endDate = new Date(formattedToDate);

  for (let i = new Date(formattedFromDate); i <= endDate; i.setDate(i.getDate() + 1)) {
    dailyPlayCount[i.toISOString().split("T")[0]] = 0;
  }

  loadedPlays.forEach(play => {
    const playDate = play.date.toString();
    if (dailyPlayCount[playDate] !== undefined) {
        dailyPlayCount[playDate] += 1;
    }
  });

  return {
    totalPlayCount: loadedPlays.length,
    dailyPlayCount
  };
}
