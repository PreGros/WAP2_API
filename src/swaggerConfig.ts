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
    security: [
      {
        ApiKeyAuth: [], // Apply the ApiKeyAuth globally
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description: "Provide your API key to access the endpoints",
        },
      },
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
        Boardgame: {
          type: "object",
          properties: {
            name: { type: "string", description: "The name of the board game.", example: "Nemesis" },
            mainPublisher: { type: "string", description: "The main publisher of the board game.", example: "Awaken Realms" },
            maxPlayers: { type: "string", description: "The maximum number of players.", example: "5" },
            minPlayers: { type: "string", description: "The minimum number of players.", example: "1" },
            bestWith: { type: "string", description: "The recommended number of players.", example: "Best with 4–5 players" },
            suggestedPlayerCount: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  playerCount: { type: "integer", description: "The number of players.", example: 4 },
                  votedBest: { type: "integer", description: "Number of votes for best player count.", example: 458 },
                  votedRecommended: { type: "integer", description: "Number of votes for recommended player count.", example: 212 },
                  votedNotRecommended: { type: "integer", description: "Number of votes for not recommended player count.", example: 7 },
                },
              },
            },
            statistics: {
              type: "object",
              properties: {
                userRatedCount: { type: "integer", description: "Number of users who rated the game.", example: 33627 },
                averageRating: { type: "number", format: "float", description: "The average rating of the game.", example: 8.25563 },
                bayesAverageRating: { type: "number", format: "float", description: "The Bayesian average rating of the game.", example: 7.94828 },
                ranks: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      rankId: { type: "string", description: "The ID of the rank.", example: "1" },
                      rankName: { type: "string", description: "The name of the rank.", example: "Board Game Rank" },
                      rank: { type: "integer", description: "The rank value.", example: 22 },
                    },
                  },
                },
                owned: { type: "integer", description: "Number of users who own the game.", example: 45547 },
                trading: { type: "integer", description: "Number of users trading the game.", example: 217 },
                wanting: { type: "integer", description: "Number of users wanting the game.", example: 1197 },
                wishing: { type: "integer", description: "Number of users wishing for the game.", example: 14320 },
                numComments: { type: "integer", description: "Number of comments on the game.", example: 5083 },
                numWeights: { type: "integer", description: "Number of weight ratings.", example: 1216 },
                averageWeight: { type: "number", format: "float", description: "The average weight (complexity) of the game.", example: 3.4819 },
              },
            },
            otherInfo: {
              type: "object",
              properties: {
                expansionsCount: { type: "integer", description: "Number of expansions available for the game.", example: 15 },
                accessoriesCount: { type: "integer", description: "Number of accessories available for the game.", example: 20 },
                designersCount: { type: "integer", description: "Number of designers involved in the game.", example: 1 },
                artistsCount: { type: "integer", description: "Number of artists involved in the game.", example: 4 },
                publishersCount: { type: "integer", description: "Number of publishers involved in the game.", example: 13 },
                expansions: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "The ID of the expansion.", example: "418446" },
                      name: { type: "string", description: "The name of the expansion.", example: "Awaken Realms Vault: Story Dice – AR Board Game Dice Bundle Box" },
                    },
                  },
                },
                accessories: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "The ID of the accessory.", example: "408470" },
                      name: { type: "string", description: "The name of the accessory.", example: "Nemesis: Acrylic Tokens" },
                    },
                  },
                },
                designers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "The ID of the designer.", example: "61569" },
                      name: { type: "string", description: "The name of the designer.", example: "Adam Kwapiński" },
                    },
                  },
                },
                artists: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "The ID of the artist.", example: "39040" },
                      name: { type: "string", description: "The name of the artist.", example: "Piotr Foksowicz" },
                    },
                  },
                },
                publishers: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id: { type: "string", description: "The ID of the publisher.", example: "29412" },
                      name: { type: "string", description: "The name of the publisher.", example: "Awaken Realms" },
                    },
                  },
                },
              },
            },
            marketplaceListing: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  listDate: { type: "string", format: "date-time", description: "The date the listing was created.", example: "Wed, 28 Nov 2018 02:41:49 +0000" },
                  currency: { type: "string", description: "The currency of the listing price.", example: "USD" },
                  price: { type: "number", format: "float", description: "The price of the listing.", example: 320 },
                  condition: { type: "string", description: "The condition of the board game.", example: "new" },
                  notes: { type: "string", description: "Additional notes about the listing.", example: "Kickstarter Intruder pledge. No sundropping." },
                  link: { type: "string", format: "uri", description: "A link to the listing.", example: "https://boardgamegeek.com/market/product/1681947" },
                },
              },
            },
          },
        },
        SoloRef: {
          type: "object",
          properties: {
            soloRef: {
              type: "object",
              properties: {
                best: { type: "number", description: "Percentage of best votes.", example: 0.04 },
                recommended: { type: "number", description: "Percentage of recommended votes.", example: 0.61 },
                notRecommended: { type: "number", description: "Percentage of not recommended votes.", example: 0.35 },
              },
            },
          },
        },
        PublishersResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Response message.",
              example: "Boardgame publishers",
            },
            publishers: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  name: {
                    type: "string",
                    description: "The name of the publisher.",
                    example: "Awaken Realms",
                  },
                },
              },
            },
          },
        },
        MarketplaceResponse: {
          type: "object",
          properties: {
            listingsCout: {
              type: "integer",
              description: "The total number of marketplace listings.",
              example: 1,
            },
            marketListings: {
              type: "array",
              description: "List of marketplace listings.",
              items: {
                type: "object",
                properties: {
                  listDate: {
                    type: "string",
                    format: "date",
                    description: "The date the listing was created.",
                    example: "Mon, 24 Mar 2025 17:49:13 +0000",
                  },
                  currency: {
                    type: "string",
                    description: "The currency of the listing price.",
                    example: "USD",
                  },
                  price: {
                    type: "number",
                    description: "The price of the listing.",
                    example: 100,
                  },
                  condition: {
                    type: "string",
                    description: "The condition of the board game.",
                    example: "verygood",
                  },
                  notes: {
                    type: "string",
                    description: "Additional notes about the listing.",
                    example: "Includes free shipping to the Continental US.",
                  },
                  link: {
                    type: "string",
                    description: "A link to the listing.",
                    example: "https://boardgamegeek.com/market/product/3703632",
                  },
                },
              },
            },
          },
        },
        SearchData: {
          type: "object",
          properties: {
            id: {
              type: "string",
              description: "The unique ID of the item.",
              example: "167355",
            },
            name: {
              type: "string",
              description: "The name of the item.",
              example: "Nemesis",
            },
            yearPublished: {
              type: "string",
              format: "date-time",
              description: "The year the item was published.",
              example: "2018-01-01T00:00:00.000Z",
            },
            type: {
              type: "string",
              description: "The type of the item (e.g., boardgame, rpg, videogame).",
              example: "boardgame",
            },
          },
        },
        UserCollection: {
          type: "object",
          properties: {
            username: {
              type: "string",
              description: "The username of the user.",
              example: "Pregros",
            },
            collectionItems: {
              type: "array",
              description: "A list of items in the user's collection.",
              items: {
                type: "object",
                properties: {
                  id: {
                    type: "string",
                    description: "The unique ID of the item.",
                    example: "316554",
                  },
                  name: {
                    type: "string",
                    description: "The name of the item.",
                    example: "Dune: Imperium",
                  },
                  yearPublished: {
                    type: "string",
                    format: "date-time",
                    description: "The year the item was published.",
                    example: "2020-01-01T00:00:00.000Z",
                  },
                  type: {
                    type: "string",
                    description: "The type of the item (e.g., boardgame, rpg, videogame).",
                    example: "boardgame",
                  },
                  numPlays: {
                    type: "integer",
                    description: "The number of times the item has been played.",
                    example: 0,
                  },
                  lastModified: {
                    type: "string",
                    format: "date-time",
                    description: "The last modification date of the item.",
                    example: "2024-07-21T15:58:00.000Z",
                  },
                  statusCode: {
                    type: "string",
                    description: "An 8-digit code where each digit can be 0 or 1, representing the item's statuses (own, preowned, fortrade, want, wanttoplay, wanttobuy, wishlist, preordered).",
                    example: "00000010",
                  },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

export default swaggerOptions;