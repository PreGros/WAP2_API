import axios, { all } from "axios";
import { XMLParser } from "fast-xml-parser";
import { Play } from "../models/play";

export const getPlaysById = async (id: string, fromDate: string | undefined, toDate: string | undefined): Promise<string> => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedFromDate = fromDate ?? yesterday.toISOString().split("T")[0]; // Default to yesterday's date
  const formattedToDate = toDate ?? today.toISOString().split("T")[0]; // Default to today's date

  let pageCount = -1;
  let page = 1;
  let allPlays: Play[] = [];

  try {
    while (page <= pageCount || pageCount == -1) 
    {
      const response = await axios.get('https://boardgamegeek.com/xmlapi2/plays', {
        params: {
            id: id,
            mindate: formattedFromDate,
            maxdate: formattedToDate,
            page: page
        }
      });
      page++;

      const parser = new XMLParser({ ignoreAttributes: false });
      const parsedData = parser.parse(response.data);

      if (pageCount == -1) {
        const totalContent = parseInt(parsedData.plays?.["@_total"], 10);
        pageCount = Math.ceil(totalContent / 100);
        if (pageCount == 0) {
          const err = new Error("Fetch data failed");
          (err as any).statusCode = 400;
          (err as any).details = "No data found with given parameters.";
          throw err;
        }
      }

      const playObjects = parsedData.plays?.play;

      const plays: Play[] = playObjects.map((play: any) => ({
        id: play["@_id"],
        date: new Date(play["@_date"]),
        length: parseInt(play["@_length"], 10),
      }));

      allPlays = allPlays.concat(plays);

    }




      console.log(allPlays);
      console.log(allPlays.length);


    
    return "DEBUG";

  }catch (error) {
    // if (error instanceof Error) {
    //   const err = new Error("Data fetch failed");
    //   (err as any).statusCode = 400;
    //   (err as any).details = error.message;
    //   throw err;
    // } else {
      throw error;
    // }
  }
};