export interface UserCollection {
    username: string;
    collectionItem: {
        type: string;
        id: string;
        name: string;
        yearPublished: Date;
        statusCode: string;
        lastModified: Date;
    }[];
};