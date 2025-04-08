export interface Play {
    id: string;
    date: Date;
    length: number;
    item?: {
        name: string;
        objecttype: string;
        objectid: string;
        subtypes: string[];
    };
    comments?: string;
    players?: {
        userid: string;
        name: string;
        win: boolean;
    }[];
}