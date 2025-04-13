export interface UserCollection {
    username: string;
    collectionItems: {
        type: string;
        id: string;
        name: string;
        yearPublished: Date;
        statusCode: string;
        lastModified: Date;
    }[];
};