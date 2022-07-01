import { Locking } from './index';

describe('index', () => {
  let service: Locking;

  let getStub: jest.Mock;
  let setStub: jest.Mock;
  let deleteStub: jest.Mock;

  beforeEach(() => {
    getStub = jest.fn();
    setStub = jest.fn();
    deleteStub = jest.fn();

    const cache = {
      get: getStub,
      set: setStub,
      delete: deleteStub,
      flushAll: jest.fn(),
    };

    service = new Locking(cache);
  });

  describe('lock', () => {
    it('should be able to unlock once locked', async () => {
      const { unlock } = await service.lock('test-lock', 10000, 0);
      expect(unlock).toBeDefined();
    });

    jest.setTimeout(10000);
    it('should retry the correct number of times if there is already a key', async () => {
      getStub.mockResolvedValue('data');

      try {
        await service.lock('test-lock', 10000, 3);
      } catch {}

      expect(getStub.mock.calls).toHaveLength(4);
    });

    it('should successfully lock if the previous lock is unlocked', async () => {
      getStub
        .mockResolvedValueOnce('data')
        .mockResolvedValueOnce('data')
        .mockResolvedValueOnce(undefined);

      const { unlock } = await service.lock('test-lock', 10000, 3);

      expect(getStub.mock.calls).toHaveLength(3);
      expect(setStub.mock.calls).toHaveLength(1);
      expect(unlock).toBeDefined();
    });

    it('should not retry when the param is not passed', async () => {
      getStub.mockResolvedValue('data');

      try {
        await service.lock('test-lock', 10000);
      } catch {}

      expect(getStub.mock.calls).toHaveLength(1);
    });

    it('should call to delete the lock when unlock is called', async () => {
      const { unlock } = await service.lock('test-lock', 10000, 3);
      await unlock();

      expect(deleteStub.mock.calls).toHaveLength(1);
      expect(deleteStub.mock.calls[0]).toMatchObject(['test-lock']);
    });
  });
});
