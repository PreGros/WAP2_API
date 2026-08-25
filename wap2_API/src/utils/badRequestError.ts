export class BadRequestError extends Error {
    statusCode: number;
    description: string;
    constructor(statusCode: number, message: string, description: string) {
        super(message);
        this.statusCode = statusCode;
        this.description = description;
    }
}