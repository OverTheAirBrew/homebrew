import { Queues } from '@overtheairbrew/node-typedi-in-memory-queue';
import { SocketContract } from '@overtheairbrew/socket-io';
import { Service } from 'typedi';
import { IMessagingManager } from './plugin/abstractions/messaging-manager';
import { EventContract } from './plugin/messages';
import { OtaSocketServer } from './socket-io';

@Service()
export class MessagingManager implements IMessagingManager {
  constructor(private queues: Queues, private socketServer: OtaSocketServer) {}

  sendMessageToFrontEnd<Data>(contract: SocketContract<Data>) {
    return async (message: Data) => {
      await this.socketServer.sendMessage(contract)(message);
    };
  }

  sendEvent<Data>(contract: EventContract<Data>) {
    return async (message: Data) => {
      await this.queues.sendMessage(contract)(message);
    };
  }
}
