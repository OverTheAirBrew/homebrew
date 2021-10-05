import * as messaging from '@overtheairbrew/node-typedi-in-memory-queue';
import { expect } from 'chai';
import * as cron from 'cron-typedi-decorators';
import * as fg from 'fast-glob';
import { join } from 'path';
import * as routingController from 'routing-controllers';
import * as sinon from 'sinon';
import * as typedi from 'typedi';
import { OtaHomebrewApp } from '../../src/application';
import { OtaContainer } from '../../src/lib/utils/container';
import { ProgramaticMigate } from '../../src/orm/programatic-migrate';

describe.only('application', () => {
  let routeControllerUseContainerSpy: sinon.SinonSpy;
  let cronUseContainerSpy: sinon.SinonSpy;
  let messagingUseContainerSpy: sinon.SinonSpy;

  before(async () => {
    sinon.stub(typedi.Container, 'get').resolves(undefined);

    sinon.stub(OtaContainer, 'setupContainer').resolves();

    routeControllerUseContainerSpy = sinon.spy(routingController.useContainer);

    cronUseContainerSpy = sinon.spy(cron.useContainer);
    messagingUseContainerSpy = sinon.spy(messaging.useContainer);

    sinon.stub(ProgramaticMigate.prototype, 'up').resolves();
    sinon.stub(fg, 'sync').resolves([]);

    const application = new OtaHomebrewApp({
      database: {
        dialect: 'sqlite',
        storage: __dirname,
        cwd: join(__dirname, '..', '..', 'src'),
      },
      port: 9000,
      cwd: join(__dirname, '..', '..', 'src'),
    });

    await application.start();
  });

  it('should configure the containers', async () => {
    expect(
      routeControllerUseContainerSpy.callCount,
      'should setup the controller container',
    ).to.eq(1);
    expect(
      cronUseContainerSpy.callCount,
      'should setup the cron container',
    ).to.eq(1);
    expect(
      messagingUseContainerSpy.callCount,
      'should set up the messaging container',
    ).to.eq(1);
  }).timeout(10000);
});
