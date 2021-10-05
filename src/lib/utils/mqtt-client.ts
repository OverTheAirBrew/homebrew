// import { Contract } from '@overtheairbrew/homebrew-plugin';
// import { Client, connect } from 'mqtt';
// import { Service } from 'typedi';

// export interface IListener<Data> {
//   (message: Data): void | PromiseLike<void>;
// }

// @Service()
// export class MqtttClient {
//   private client: Client;

//   private listeners: Record<string, IListener<any>[]>;

//   constructor() {
//     this.connect();
//   }

//   private connect() {
//     this.client = connect('');

//     this.client.on('message', async (topic, message) => {
//       const listeners = this.listeners[topic];

//       for (const listener of listeners) {
//         await listener(JSON.parse(message.toString()));
//       }
//     });
//   }

//   public send<Data>(contract: Contract<Data>) {
//     return async (message: Data) => {
//       this.client.publish(contract.EventName, JSON.stringify(message));
//     };
//   }

//   public listenForMessage<Data>(
//     contract: Contract<Data>,
//     listener: IListener<Data>,
//   ) {
//     const queue = this.listeners[contract.EventName];

//     if (!queue) {
//       this.listeners[contract.EventName] = [listener];
//     } else {
//       this.listeners[contract.EventName] = [...queue, listener];
//     }
//   }
// }
