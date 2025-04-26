export interface Play {
    id: string;
    date: Date;
    length: number;
    comments: string;
    players: {
        userid: string;
        name: string;
        win: boolean;
    }[];
}