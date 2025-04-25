import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { SearchData } from "../models/searchData";
import NodeCache from "node-cache";
import { parse } from "path";
import { allowedNodeEnvironmentFlags } from "process";
import { BadRequestError } from "../utils/badRequestError";

const cache = new NodeCache({ stdTTL: 3600 });

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const parseSearch = (items: any): SearchData[] => {
    if (!Array.isArray(items)) {
        items = [items];
      }
    return items.map((item: any) => ({
        id: item["@_id"],
        name: item.name["@_value"],
        yearPublished: item.yearpublished ? new Date(item.yearpublished["@_value"]) : undefined,
        type: item["@_type"],
    }));
};

const fetchData = async (query: string, exact: string | undefined) => {
    
    const response = await axios.get('https://boardgamegeek.com/xmlapi2/search', {
        params: {
            query: query,
            exact: exact,
        }
    });

    const parser = new XMLParser({ ignoreAttributes: false });
    return parser.parse(response.data);
};

export const getSearchData = async (query: string, exact: string | undefined): Promise<SearchData[]> => {
    const exactParam = exact ?? "0";
    const cacheKey = `${query}-${exactParam}`;
    const cachedData = cache.get<SearchData[]>(cacheKey);

    if (cachedData) {
        console.log("Search cache hit");
        return cachedData;
    }

    let allSearch: SearchData[] = [];
    let loadedData = true;

    while (loadedData) {
        try {
            const parsedData = await fetchData(query, exactParam);
            if (!parsedData.items || !parsedData.items.item) {
                const err = new BadRequestError(404, "No data found", "No data found with given parameters.");
                throw err;
            }
            allSearch = parseSearch(parsedData.items.item);
            loadedData = false;
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

    cache.set(cacheKey, allSearch)

    return allSearch;
}

export const filterData = async (searchData: SearchData[], fromDate: string | undefined, toDate: string | undefined, type: string | undefined) => {
    let filteredData = searchData;

    if (type) {
        filteredData = filteredData.filter(searchItem => {
            const itemType = searchItem.type;
            return itemType == type;
        });
    }

    if (fromDate || toDate) {
        const from = fromDate ? new Date(fromDate) : undefined;
        const to = toDate ? new Date(toDate) : undefined;
    
        filteredData = filteredData.filter(searchItem => {
            if (!searchItem.yearPublished) {
                return false; // exluding items (yearPublished?:)
            }
            const listDate = new Date(searchItem.yearPublished);
            if (from && to) {
                return listDate >= from && listDate <= to;
            } else if (from) {
                return listDate >= from;
            } else if (to) {
                return listDate <= to;
            }
            return true;
        });
    }

    return filteredData;
}