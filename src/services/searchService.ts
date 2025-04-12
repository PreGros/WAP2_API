import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { SearchData } from "../models/searchData";
import NodeCache from "node-cache";
import { parse } from "path";

const cache = new NodeCache({ stdTTL: 3600 });

const parseSearch = (items: any): SearchData[] => {
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

    export const getSearchData = async (query: string, fromDate: string | undefined, toDate: string | undefined, exact: string | undefined): Promise<SearchData[]> => {
    const exactParam = exact ?? "0";
    const cacheKey = `${query}- ${exactParam}`;
    const cachedData = cache.get<SearchData[]>(cacheKey);

    let allSearch: SearchData[] = [];

    if (cachedData) {
        console.log("Boardgame cache hit");
        return cachedData;
    }
    
    try {
        const parsedData = await fetchData(query, exactParam);
        // console.log(parsedData.items.item);
        
        allSearch = parseSearch(parsedData.items.item);

    } catch (error) {
        throw error;
    }
    
        
    // Cache the result
    cache.set(cacheKey, allSearch)

    return allSearch;
}