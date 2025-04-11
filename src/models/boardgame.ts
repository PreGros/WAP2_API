export interface Boardgame {
    name: string;
    mainPublisher: string;
    maxPlayers: string;
    minPlayers: string;
    bestWith: string;
    suggestedPlayerCount: {
        playerCount: number;
        votedBest: number;
        votedRecommended: number;
        votedNotRecommended: number;
    }[];
    statistics: {
        userRatedCount: number;
        averageRating: number;
        bayesAverageRating: number;
        ranks: {
            rankId: string;
            rankName: string;
            rank: number;
        }[];
        owned: number;
        trading: number;
        wanting: number;
        wishing: number;
        numComments: number;
        numWeights: number;
        averageWeight: number;
    };
    otherInfo: {
        expansionsCount: number;
        accessoriesCount: number;
        designersCount: number;
        artistsCount: number;
        publishersCount: number;
        expansions: { id: string; name: string }[];
        accessories: { id: string; name: string }[];
        designers: { id: string; name: string }[];
        artists: { id: string; name: string }[];
        publishers: { id: string; name: string }[];
    };
}