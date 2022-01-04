import { expect } from 'chai';
import * as sinon from 'sinon';
import * as Winston from 'winston';
import { Logger } from '../../../src/app/lib/logger';

describe('lib/logger', () => {
  let debugSpy: sinon.SinonStub;
  let infoSpy: sinon.SinonStub;
  let warnSpy: sinon.SinonStub;
  let errorSpy: sinon.SinonStub;

  let logger: Logger;

  beforeEach(() => {
    debugSpy = sinon.stub().returns({});
    infoSpy = sinon.stub().returns({});
    warnSpy = sinon.stub().returns({});
    errorSpy = sinon.stub().returns({});

    sinon.stub(Winston, 'createLogger').returns({
      debug: debugSpy,
      info: infoSpy,
      warn: warnSpy,
      error: errorSpy,
    } as any);

    logger = new Logger({
      level: 'debug',
      node_env: 'testing',
      serviceName: 'test-service',
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should call the winston debug with the correct data', () => {
    logger.debug('test message', ['hello']);
    expect(debugSpy.callCount).to.eq(1);

    expect(debugSpy.firstCall.args).to.deep.eq(['test message', ['hello']]);
  });

  it('should call winston info with the correct data', () => {
    logger.info('test message', ['hello']);
    expect(infoSpy.callCount).to.eq(1);

    expect(infoSpy.firstCall.args).to.deep.eq(['test message', ['hello']]);
  });

  it('should call winston warn with the correct data', () => {
    logger.warn('test message', ['hello']);
    expect(warnSpy.callCount).to.eq(1);

    expect(warnSpy.firstCall.args).to.deep.eq(['test message', ['hello']]);
  });

  it('should call winston error with the correct data', () => {
    const error = new Error('test error');
    logger.error(error, ['hello']);

    expect(errorSpy.callCount).to.eq(1);
    expect(errorSpy.firstCall.args).to.deep.eq([
      error.message,
      { stack: error.stack },
      ['hello'],
    ]);
  });
});
