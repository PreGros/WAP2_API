import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { Boardgame } from "../models/boardgame";
import NodeCache from "node-cache";

const cache = new NodeCache({ stdTTL: 3600 });

const fetchboardGame = async (id: string) => {
    const response = await axios.get('https://boardgamegeek.com/xmlapi2/thing', {
        params: {
            id: id,
            stats: 1
        }
    });

    const parser = new XMLParser({ ignoreAttributes: false });
    return parser.parse(response.data);
    };

const extractStatistics = (statistics: any) => ({
    userRatedCount: parseInt(statistics.usersrated["@_value"], 10),
    averageRating: parseFloat(statistics.average["@_value"]),
    bayesAverageRating: parseFloat(statistics.bayesaverage["@_value"]),
    owned: parseInt(statistics.owned["@_value"], 10),
    trading: parseInt(statistics.trading["@_value"], 10),
    wanting: parseInt(statistics.wanting["@_value"], 10),
    wishing: parseInt(statistics.wishing["@_value"], 10),
    numComments: parseInt(statistics.numcomments["@_value"], 10),
    numWeights: parseInt(statistics.numweights["@_value"], 10),
    averageWeight: parseFloat(statistics.averageweight["@_value"]),
    ranks: Array.isArray(statistics.ranks.rank)
        ? statistics.ranks.rank.map((rank: any) => ({
            rankId: rank["@_id"],
            rankName: rank["@_friendlyname"],
            rank: parseInt(rank["@_value"], 10),
        }))
        : [],
});

const extractLinks = (links: any[]) => {
    const otherInfo = {
        expansionsCount: 0,
        accessoriesCount: 0,
        designersCount: 0,
        artistsCount: 0,
        publishersCount: 0,
        expansions: [] as { id: string; name: string }[],
        accessories: [] as { id: string; name: string }[],
        designers: [] as { id: string; name: string }[],
        artists: [] as { id: string; name: string }[],
        publishers: [] as { id: string; name: string }[],
    };

    links.forEach((link) => {
        const id = link["@_id"];
        const name = link["@_value"];
        switch (link["@_type"]) {
            case "boardgameexpansion":
                otherInfo.expansions.push({ id, name });
                break;
            case "boardgameaccessory":
                otherInfo.accessories.push({ id, name });
                break;
            case "boardgamedesigner":
                otherInfo.designers.push({ id, name });
                break;
            case "boardgameartist":
                otherInfo.artists.push({ id, name });
                break;
            case "boardgamepublisher":
                otherInfo.publishers.push({ id, name });
                break;
        }
    });

    // Update counts
    otherInfo.expansionsCount = otherInfo.expansions.length;
    otherInfo.accessoriesCount = otherInfo.accessories.length;
    otherInfo.designersCount = otherInfo.designers.length;
    otherInfo.artistsCount = otherInfo.artists.length;
    otherInfo.publishersCount = otherInfo.publishers.length;

    return otherInfo;
};

export const getBoardgameById = async (id: string): Promise<Boardgame> => {
    const cacheKey = `${id}`;
    const cachedData = cache.get<Boardgame>(cacheKey);

    if (cachedData) {
    console.log("Boardgame cache hit");
    return cachedData;
    }

    let foundBoardGame: Boardgame = {
        name: "",
        mainPublisher: "",
        maxPlayers: "",
        minPlayers: "",
        bestWith: "",
        suggestedPlayerCount: [],
        statistics: {
            userRatedCount: 0,
            averageRating: 0,
            bayesAverageRating: 0,
            ranks: [],
            owned: 0,
            trading: 0,
            wanting: 0,
            wishing: 0,
            numComments: 0,
            numWeights: 0,
            averageWeight: 0,
        },
        otherInfo: {
            expansionsCount: 0,
            accessoriesCount: 0,
            designersCount: 0,
            artistsCount: 0,
            publishersCount: 0,
            expansions: [],
            accessories: [],
            designers: [],
            artists: [],
            publishers: []
        }
    };

    try {
        const parsedData = await fetchboardGame(id);
        const item = parsedData.items.item;

        foundBoardGame.name = item.name[0]["@_value"];
        foundBoardGame.bestWith = item["poll-summary"].result[0]["@_value"];
        foundBoardGame.maxPlayers = item.maxplayers["@_value"];
        foundBoardGame.minPlayers = item.minplayers["@_value"];
        foundBoardGame.statistics = extractStatistics(item.statistics.ratings);

        if (Array.isArray(item.link)) {
            foundBoardGame.otherInfo = extractLinks(item.link);
        }

        foundBoardGame.mainPublisher = foundBoardGame.otherInfo.publishers[0]?.name || "";

        // console.log(parsedData.items.item.poll[0].results[0]);

        const results = parsedData.items.item.poll[0].results;
        foundBoardGame.suggestedPlayerCount = Array.isArray(results)
                                            ? results.map((result: any) => ({
                                                playerCount: result["@_numplayers"],
                                                votedBest: result.result[0]["@_numvotes"],
                                                votedRecommended: result.result[1]["@_numvotes"],
                                                votedNotRecommended: result.result[2]["@_numvotes"],
                                            }))
                                            : [];


    } catch (error) {
        throw error;
    }

    
    // Cache the result
    cache.set(cacheKey, foundBoardGame)

    return foundBoardGame;
}