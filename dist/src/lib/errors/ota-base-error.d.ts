export declare abstract class BaseError extends Error {
    readonly httpCode: number;
    readonly errorCode: string;
    constructor(message: string, opts: {
        httpCode: number;
        errorCode: string;
    });
}
