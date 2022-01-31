import Container, { Service } from 'typedi';
import { ActorStateChanged } from '../messages/events/actor-state-changed';
import { Peripheral, PeripheralLocalizations, Property } from '../properties';
import { IMessagingManager } from './messaging-manager';

@Service()
export abstract class Actor<T> extends Peripheral {
  private messagingManager: IMessagingManager;

  constructor(
    actorName: string,
    public properties: Property[],
    public localizations: PeripheralLocalizations,
  ) {
    super(`${actorName}-actor`, properties, localizations);
    this.messagingManager = Container.get(IMessagingManager);
  }

  public async on(actor_id: string, params: T) {
    await this.processOn(params);

    await this.messagingManager.sendEvent(ActorStateChanged)({
      actor_id,
      state: 'on',
    });
  }

  public async off(actor_id: string, params: T) {
    await this.processOff(params);

    await this.messagingManager.sendEvent(ActorStateChanged)({
      actor_id,
      state: 'off',
    });
  }

  protected abstract processOn(params: T): Promise<void>;
  protected abstract processOff(params: T): Promise<void>;
}
