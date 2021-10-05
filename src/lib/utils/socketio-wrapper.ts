// import { Server as SocketServer } from 'socket.io';
// import { Server } from 'http';
// import { Service, Container } from 'typedi';

// @Service()
// export class OtaSockets {
//   private socketServer: SocketServer;

//   constructor() {
//     const httpServer: Server = Container.get('http');
//     this.socketServer = new SocketServer(httpServer, {
//       path: '/server/socket.io',
//     });
//   }

//   public sendMessage<Data>(message: Contract<Data>) {
//     return async (request: Data) => {
//       this.socketServer.emit(message.EventName, request);
//     };
//   }

//   public listenForMessage<Data>(
//     contract: Contract<Data>,
//     listener: IListener<Data>,
//   ) {
//     this.socketServer.on(contract.EventName, async (message) => {
//       await listener(message);
//     });
//   }
// }

// export interface Contract<Data extends Object> {
//   EventName: string;
//   Data: Data;
// }

// export interface IListener<Data> {
//   (message: Data): void | PromiseLike<void>;
// }
