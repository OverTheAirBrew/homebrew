import { EventEmitter2 } from '@nestjs/event-emitter';
import { Test } from '@nestjs/testing';
import { ActorStateChanged } from '@ota-internal/shared';
import { DummyActor } from '.';

describe('plugin/gpio', () => {
  let service: DummyActor;

  let emitStub: jest.Mock;

  beforeEach(async () => {
    emitStub = jest.fn();

    const moduleRef = await Test.createTestingModule({
      providers: [
        DummyActor,
        {
          provide: EventEmitter2,
          useFactory: () => ({
            emit: emitStub,
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(DummyActor);
  });

  it('should turn on when requested', async () => {
    await service.on('test', {});

    expect(emitStub).toHaveBeenCalled();
    expect(emitStub.mock.calls[0]).toMatchObject([
      ActorStateChanged.Channel,
      {
        actor_id: 'test',
        state: 'on',
      },
    ]);
  });

  it('should turn off when requested', async () => {
    await service.off('test', {});

    expect(emitStub).toHaveBeenCalled();
    expect(emitStub.mock.calls[0]).toMatchObject([
      ActorStateChanged.Channel,
      {
        actor_id: 'test',
        state: 'off',
      },
    ]);
  });
});
