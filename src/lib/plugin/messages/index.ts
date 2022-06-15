export * from './sockets/sensor-reading';

export interface SocketContract<Data extends Object> {
  EventName: string;
  Data: Data;
}

export interface EventContract<Data extends Object> {
  Topic: string;
  Data: Data;
}
