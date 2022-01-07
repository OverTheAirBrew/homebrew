import { expect } from 'chai';
import * as onOff from 'onoff';
import * as sinon from 'sinon';
import { GpioActor } from '../../../src/app/plugins/actor/gpio';

describe('plugin/gpio', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('index', () => {
    let gpioActor: GpioActor;

    let onOffStub: sinon.SinonStub;
    let writeSyncStub: sinon.SinonStub;

    beforeEach(() => {
      writeSyncStub = sinon.stub();

      onOffStub = sinon.stub(onOff, 'Gpio').callsFake(() => {
        return {
          writeSync: writeSyncStub,
        };
      });

      gpioActor = new GpioActor();
    });

    it('should turn on the gpio when its requested', async () => {
      await gpioActor.on({ gpio: 1 });

      expect(onOffStub.callCount).to.eq(1);
      expect(onOffStub.firstCall.args).to.deep.eq([1, 'out']);

      expect(writeSyncStub.callCount).to.eq(1);
      expect(writeSyncStub.firstCall.args).to.deep.eq([1]);
    });

    it('should turn off the gpio when its requested', async () => {
      await gpioActor.off({ gpio: 1 });

      expect(onOffStub.callCount).to.eq(1);
      expect(onOffStub.firstCall.args).to.deep.eq([1, 'out']);

      expect(writeSyncStub.callCount).to.eq(1);
      expect(writeSyncStub.firstCall.args).to.deep.eq([0]);
    });
  });
});
