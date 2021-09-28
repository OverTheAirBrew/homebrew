export declare class OtaSockets {
    private socketServer;
    constructor();
    sendMessage<Data>(message: Contract<Data>): (request: Data) => Promise<void>;
    listenForMessage<Data>(contract: Contract<Data>, listener: IListener<Data>): void;
}
export interface Contract<Data extends Object> {
    EventName: string;
    Data: Data;
}
export interface IListener<Data> {
    (message: Data): void | PromiseLike<void>;
}
