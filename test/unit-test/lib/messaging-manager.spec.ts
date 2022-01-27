import { Queues } from '@overtheairbrew/node-typedi-in-memory-queue';
import { expect } from 'chai';
import sinon, { stubConstructor } from 'ts-sinon';
import { MessagingManager } from '../../../src/app/lib/messaging-manager';
import { ActorStateChanged } from '../../../src/app/lib/plugin/messages/events/actor-state-changed';
import { SensorReading } from '../../../src/app/lib/plugin/messages/sockets/sensor-reading';
import { OtaSocketServer } from '../../../src/app/lib/socket-io';

describe('lib/messaging-manager', () => {
  let messagingManager: MessagingManager;

  let queuesStub: sinon.SinonStub;
  let socketStub: sinon.SinonStub;

  beforeEach(() => {
    queuesStub = sinon.stub();
    socketStub = sinon.stub();

    const queues = stubConstructor(Queues);
    queues.sendMessage.returns(queuesStub);

    const sockets = stubConstructor(OtaSocketServer);
    sockets.sendMessage.returns(socketStub);

    messagingManager = new MessagingManager(queues, sockets);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('sendMessageToFrontEnd', () => {
    it('should send a socket message', async () => {
      await messagingManager.sendMessageToFrontEnd(SensorReading)({
        sensor_id: '1234',
        value: 1,
      });

      expect(socketStub.callCount).to.eq(1);
    });
  });

  describe('sendMessageToFrontEnd', () => {
    it('should send a socket message', async () => {
      await messagingManager.sendEvent(ActorStateChanged)({
        actor_id: '1234',
        state: 'on',
      });

      expect(queuesStub.callCount).to.eq(1);
    });
  });
});
