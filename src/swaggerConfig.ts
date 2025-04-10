import { Options } from "swagger-jsdoc";

const swaggerOptions: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "WAP2 API Documentation",
      version: "1.0.0",
      description: "API documentation for the WAP2 project",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Local server",
      },
    ],
    components: {
      schemas: {
        Play: {
          type: "object",
          properties: {
            id: { type: "string", example: "12345" },
            date: { type: "string", format: "date", example: "2025-04-08" },
            length: { type: "integer", example: 120 },
            players: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  userid: { type: "string", example: "67890" },
                  name: { type: "string", example: "John Doe" },
                  win: { type: "boolean", example: true },
                },
              },
            },
          },
        },
        Summary: {
          type: "object",
          properties: {
            totalPlays: { type: "integer", example: 10 },
            playTimeStats: {
              type: "object",
              properties: {
                totalPlayTime: { type: "integer", example: 1200 },
                nonZeroPlayCount: { type: "integer", example: 8 },
                maxPlayTime: { type: "integer", example: 180 },
                minPlayTime: { type: "integer", example: 30 },
                averagePlayTime: { type: "number", example: 150 },
              },
            },
            uniquePlayers: { type: "integer", example: 5 },
            dateRange: {
              type: "object",
              properties: {
                from: { type: "string", format: "date", example: "2025-04-01" },
                to: { type: "string", format: "date", example: "2025-04-09" },
              },
            },
          },
        },
        WinRate: {
          type: "object",
          properties: {
            playersRecordedLen: {
              type: "integer",
              example: 11,
            },
            winCounts: {
              type: "object",
              properties: {
                "0playerwinrate": { type: "integer", example: 6 },
                "1playerwinrate": { type: "integer", example: 1 },
                "2playerwinrate": { type: "integer", example: 4 },
                "3playerwinrate": { type: "integer", example: 0 },
                "4playerwinrate": { type: "integer", example: 0 },
                "5playerwinrate": { type: "integer", example: 0 },
              },
            },
          },
        },
        DailyStats: {
          type: "object",
          properties: {
            totalPlayCount: {
              type: "integer",
              example: 171,
            },
            dailyPlayCount: {
              type: "object",
              additionalProperties: {
                type: "integer",
              },
              example: {
                "2025-04-01": 8,
                "2025-04-02": 10,
                "2025-04-03": 10,
                "2025-04-04": 18,
                "2025-04-05": 58,
                "2025-04-06": 35,
                "2025-04-07": 1,
                "2025-04-08": 14,
                "2025-04-09": 10,
                "2025-04-10": 7,
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"], // Path to the API docs
};

export default swaggerOptions;