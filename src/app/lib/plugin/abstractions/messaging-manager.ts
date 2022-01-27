import { ClassType } from '../class-type';
import { EventContract, SocketContract } from '../messages';

export interface IMessagingManager {
  sendMessageToFrontEnd<Data>(
    message: SocketContract<Data>,
  ): (message: Data) => Promise<void>;

  sendEvent<Data>(
    message: EventContract<Data>,
  ): (message: Data) => Promise<void>;
}

export const IMessagingManager = class Dummy {} as ClassType<IMessagingManager>;
