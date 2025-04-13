import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { UserCollection } from "../models/userCollection";
import NodeCache from "node-cache";

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
};

const parseCollectionItems = (items: any) => {
  return items.map((item: any) => ({
    id: item["@_objectid"],
    name: item.name["#text"],
    yearPublished: item.yearpublished ? new Date(`${item.yearpublished}-01-01`) : null,
    type: item["@_subtype"],
    lastModified: item.status["@_lastmodified"] ? new Date(item.status["@_lastmodified"]) : null,
    statusCode: `${item.status["@_own"]}${item.status["@_prevowned"]}${item.status["@_fortrade"]}${item.status["@_want"]}${item.status["@_wanttoplay"]}${item.status["@_wanttobuy"]}${item.status["@_wishlist"]}${item.status["@_preordered"]}`,
  }));
};

export const getCollection = async (givenUsername: string): Promise<UserCollection> => {
    const cacheKey = `${givenUsername}`;
    const cachedData = cache.get<UserCollection>(cacheKey);

    if (cachedData) {
        console.log("Colelction cache hit");
        return cachedData;
    }

    let userCollection: UserCollection = {
        username: "",
        collectionItem: [],
    };

    let isCollectionEmpty = true;
    let alreadyTried = 0;
    
    while (isCollectionEmpty) {
        try {
            const parsedData = await fetchData(givenUsername);
            if (!parsedData.items || !parsedData.items.item) {
                const err = new Error("Fetch data failed");
                (err as any).statusCode = 404;
                (err as any).details = "No data found with given parameters.";
                throw err;
            }
            isCollectionEmpty = false;
            userCollection.username = givenUsername;
            userCollection.collectionItem = parseCollectionItems(parsedData.items.item);
        } catch (error: any) {
            if (error.statusCode === 404) {
                if (alreadyTried == 4) {
                    throw error;
                }
                alreadyTried++;
                const retryAfter = 0.5;
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