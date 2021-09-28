import { Contract, IMessagingManager } from '@overtheairbrew/homebrew-plugin';
import { SocketIo } from '@overtheairbrew/socket-io';
import { Service } from 'typedi';

@Service()
export class MessagingManager implements IMessagingManager {
  constructor(private socketio: SocketIo) {}

  sendMessage<Data>(contract: Contract<Data>) {
    console.log('SENDING MESSAGE');

    return async (message: Data) => {
      await this.socketio.send(contract)(message);
    };
  }
}
