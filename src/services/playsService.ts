import axios from "axios";
import { XMLParser } from "fast-xml-parser"; // Import fast-xml-parser


export const getPlaysById = async (id: string, fromDate: string | undefined, toDate: string | undefined): Promise<string> => {
  // Generate default dates if fromDate or toDate is undefined
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const formattedFromDate = fromDate ?? yesterday.toISOString().split("T")[0]; // Default to yesterday's date
  const formattedToDate = toDate ?? today.toISOString().split("T")[0]; // Default to today's date

  console.log(`${formattedFromDate}`);
  console.log(`${formattedToDate}`);

  try {
    // Fetch data from the external API
    const response = await axios.get('https://boardgamegeek.com/xmlapi2/plays', {
      params: {
          id: id,
          mindate: formattedFromDate,
          maxdate: formattedToDate
      }
    });

    // Parse the XML response
    const parser = new XMLParser();
    const parsedData = parser.parse(response.data);

    // Check if the response contains no data
    if (!parsedData.plays || !parsedData.plays.play) {
      const err = new Error("No data found for the given parameters");
      (err as any).statusCode = 404; // Not Found
      throw err;
    }

    // Return the raw XML data (or process it if needed)
    return response.data;
  }catch (error) {
    if (error instanceof Error) {
      const err = new Error("Data fetch failed");
      (err as any).statusCode = 400;
      (err as any).details = error.message;
      throw err;
    } else {
      throw error;
    }
  }
};