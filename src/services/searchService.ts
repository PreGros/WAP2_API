import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import { SearchData } from "../models/searchData";
import NodeCache from "node-cache";
import { parse } from "path";
import { allowedNodeEnvironmentFlags } from "process";

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

export const getSearchData = async (query: string, exact: string | undefined): Promise<SearchData[]> => {
    const exactParam = exact ?? "0";
    const cacheKey = `${query}- ${exactParam}`;
    const cachedData = cache.get<SearchData[]>(cacheKey);

    if (cachedData) {
        console.log("Boardgame cache hit");
        return cachedData;
    }

    let allSearch: SearchData[] = [];
    
    try {
        const parsedData = await fetchData(query, exactParam);
        if (!parsedData.items || !parsedData.items.item) {
            throw new Error("No data found for the given query.")
        }
        allSearch = parseSearch(parsedData.items.item);
    } catch (error: any) {
        error.statusCode = 404;
        throw error;
    }

    cache.set(cacheKey, allSearch)

    return allSearch;
}

export const filterData = async (searchData: SearchData[], fromDate: string | undefined, toDate: string | undefined) => {
    let filteredData = searchData;

    if (fromDate || toDate) {
        const from = fromDate ? new Date(fromDate) : undefined;
        const to = toDate ? new Date(toDate) : undefined;
    
        filteredData = searchData.filter(search => {
            if (!search.yearPublished) {
                return false; // exluding items (yearPublished?:)
            }
            const listDate = new Date(search.yearPublished);
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