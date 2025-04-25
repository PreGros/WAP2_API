import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { UserCollection } from "../models/userCollection";
import NodeCache from "node-cache";
import { BadRequestError } from "../utils/badRequestError";

const cache = new NodeCache({ stdTTL: 3600 });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const fetchData = async (givenUsername: string) => {
    const response = await axios.get('https://boardgamegeek.com/xmlapi2/collection', {
        params: {
            username: givenUsername,
        }
    });

    const parser = new XMLParser({ ignoreAttributes: false });
    return parser.parse(response.data);
}

const parseCollectionItems = (items: any) => {
    return items.map((item: any) => {
        const id = item["@_objectid"] ?? "";
        const name = item.name?.["#text"] ?? "";
        const yearPublished = item.yearpublished ? new Date(`${item.yearpublished}-01-01`) : new Date(-8640000000000000);
        const type = item["@_subtype"] ?? "";
        const numPlays = item.numplays ? parseInt(item.numplays, 10) : 0;
        const lastModified = item.status?.["@_lastmodified"] ? new Date(item.status["@_lastmodified"]) : new Date(-8640000000000000);

        const statusFields = [
        item.status?.["@_own"] ?? "0",
        item.status?.["@_prevowned"] ?? "0",
        item.status?.["@_fortrade"] ?? "0",
        item.status?.["@_want"] ?? "0",
        item.status?.["@_wanttoplay"] ?? "0",
        item.status?.["@_wanttobuy"] ?? "0",
        item.status?.["@_wishlist"] ?? "0",
        item.status?.["@_preordered"] ?? "0",
        ];
        const statusCode = statusFields.join("");

        return {
        id,
        name,
        yearPublished,
        type,
        numPlays,
        lastModified,
        statusCode,
        };
    });
}

export const getCollection = async (givenUsername: string): Promise<UserCollection> => {
    const cacheKey = `${givenUsername}`;
    const cachedData = cache.get<UserCollection>(cacheKey);

    if (cachedData) {
        console.log("Collection cache hit");
        return cachedData;
    }

    let userCollection: UserCollection = {
        username: givenUsername,
        collectionItems: [],
    };

    let isCollectionEmpty = true;
    let alreadyTried = 0;
    const tryLimit = 10;
    
    while (isCollectionEmpty) {
        try {
            const parsedData = await fetchData(givenUsername);
            if (!parsedData.items || !parsedData.items.item) {
                if (parsedData.message && parsedData.message == "Your request for this collection has been accepted and will be processed.  Please try again later for access.") {
                    if (alreadyTried >= tryLimit) {
                        const err = new BadRequestError(504 , "No data was given", "The source API did not respond within the expected time frame.");
                        throw err;
                    }
                    alreadyTried++;
                    const retryAfter = 0.5;
                    console.log("Going to sleep");
                    await sleep(retryAfter * 1000);
                    continue;
                }
                else {
                    return userCollection;
                }
            }
            isCollectionEmpty = false;
            userCollection.collectionItems = parseCollectionItems(parsedData.items.item);
        } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 429) {
                const retryAfter = 10;
                console.warn(`Source API rate limit hit. Retrying after ${retryAfter} seconds...`);
                await sleep(retryAfter * 1000);
                continue; 
            } else {
                throw error;
            }
        }
    }

    cache.set(cacheKey, userCollection);

    return userCollection;
}

export const filterCollection = async (collectionData: UserCollection, displayArgs: string | undefined) => {
    let filteredCollectionData = collectionData;

    if (displayArgs) {
        const displaySwitchers = new Map<string, number>([ // arg and index in statusCode
            ["own", 0],
            ["prevowned", 1],
            ["fortrade", 2],
            ["want", 3],
            ["wanttoplay", 4],
            ["wanttobuy", 5],
            ["wishlist", 6],
            ["preordered", 7]
        ]);

        const switchMap = new Map();

        const displayArgsArray = displayArgs.split(',');
        displayArgsArray.forEach(displayArg => { // parse input displayArgs to switchMap 
            const splitArg = displayArg.split('=');
            if (splitArg.length > 1 && displaySwitchers.has(splitArg[0]) && (splitArg[1] == "0" || splitArg[1] == "1")) {
                switchMap.set(splitArg[0], splitArg[1]);
            }
        });
        filteredCollectionData.collectionItems = filteredCollectionData.collectionItems.filter(collectionItem => { // check every item if status code is correct for every arg in switchMap
            for (const [key, value] of switchMap) {
                const index = displaySwitchers.get(key) ?? 0;
                if (value !== collectionItem.statusCode[index]) {
                    return false;
                }
            }
            return true;
        });
    }

    return filteredCollectionData;
}
