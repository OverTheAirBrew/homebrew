import { Contract, IMessagingManager } from '@overtheairbrew/homebrew-plugin';
import { SocketIo } from '@overtheairbrew/socket-io';
export declare class MessagingManager implements IMessagingManager {
    private socketio;
    constructor(socketio: SocketIo);
    sendMessage<Data>(contract: Contract<Data>): (message: Data) => Promise<void>;
}
