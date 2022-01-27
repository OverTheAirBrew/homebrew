export interface SocketContract<Data extends Object> {
  EventName: string;
  Data: Data;
}

export interface ISocketListener<Data> {
  (message: Data): void | PromiseLike<void>;
}
