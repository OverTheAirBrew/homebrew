import { expect } from 'chai';
import * as glob from 'fast-glob';
import { writeSync } from 'fs';
import { dirname } from 'path';
import * as sinon from 'sinon';
import { FileResult, fileSync, setGracefulCleanup } from 'tmp';
import { stubConstructor } from 'ts-sinon';
import Container from 'typedi';
import { OneWireSensor } from '../../../src/app/plugins/sensors/one-wire';
import {
  DS18B20Controller,
  IOneWireController,
  StreamController,
  Temperature,
} from '../../../src/app/plugins/sensors/one-wire/controllers';

setGracefulCleanup();

describe('plugin/one-wire', () => {
  afterEach(() => {
    sinon.restore();
  });

  describe('index', () => {
    describe('OneWireSensor', () => {
      let sensor: OneWireSensor;

      beforeEach(() => {
        const oneWireController = stubConstructor(StreamController);
        oneWireController.findDevices.resolves(['28-000004c8b8d3']);
        oneWireController.getCurrentValue.resolves(new Temperature(20));

        Container.set(IOneWireController, oneWireController);

        sensor = new OneWireSensor();
      });

      it('should apply a positive offset', async () => {
        const value = await sensor.run({
          sensorAddress: '28-000004c8b8d3',
          sensor_id: '1234',
          offset: -10,
        });

        expect(value).to.eq(10);
      });

      it('should apply a positive offset', async () => {
        const value = await sensor.run({
          sensorAddress: '28-000004c8b8d3',
          sensor_id: '1234',
          offset: 10,
        });

        expect(value).to.eq(30);
      });

      it('should return null when the device does not exist', async () => {
        const value = await sensor.run({
          sensorAddress: '28-000004c8b82d3',
          sensor_id: '1234',
          offset: 0,
        });

        expect(value).to.be.null;
      });

      it('should return the correct data', async () => {
        const value = await sensor.run({
          sensorAddress: '28-000004c8b8d3',
          sensor_id: '1234',
          offset: 0,
        });

        expect(value).to.eq(20);
      });
    });
  });

  describe('controller', () => {
    describe('temperature', () => {
      it('should return the correct values', async () => {
        const temperature = new Temperature(10.0);
        expect(temperature.celcius).to.eq(10.0);
        expect(temperature.farenheit).to.eq(50.0);
      });
    });

    describe('stream', () => {
      describe('getCurrentValue', () => {
        it('should throw an error if there are no values', async () => {
          const controller = new StreamController(true, []);

          try {
            await controller.getCurrentValue('');
            expect.fail('should have thrown an error');
          } catch (err) {
            expect(err.message).to.eq('No values');
          }
        });

        it('should error if there is a device with no values', async () => {
          const controller = new StreamController(true, [
            { address: '1234', expectedValues: [] },
          ]);

          try {
            await controller.getCurrentValue('');
            expect.fail('should have thrown an error');
          } catch (err) {
            expect(err.message).to.eq('No values');
          }
        });

        it('should cycle through the given values', async () => {
          const controller = new StreamController(true, [
            { address: '1234', expectedValues: [1, 2, 3, 4] },
          ]);

          const firstValue = await controller.getCurrentValue('1234');
          expect(firstValue.celcius).to.eq(1);

          const secondValue = await controller.getCurrentValue('1234');
          expect(secondValue.celcius).to.eq(2);

          const thirdValue = await controller.getCurrentValue('1234');
          expect(thirdValue.celcius).to.eq(3);

          const fourthValue = await controller.getCurrentValue('1234');
          expect(fourthValue.celcius).to.eq(4);

          const secondFirst = await controller.getCurrentValue('1234');
          expect(secondFirst.celcius).to.eq(1);
        });

        it('should error when not repeatable and requests greater then values', async () => {
          const controller = new StreamController(false, [
            { address: '1234', expectedValues: [1, 2, 3, 4] },
          ]);

          try {
            await controller.getCurrentValue('1234');
            await controller.getCurrentValue('1234');
            await controller.getCurrentValue('1234');
            await controller.getCurrentValue('1234');
            await controller.getCurrentValue('1234');

            expect.fail('should have errored');
          } catch (err) {
            expect(err.message).to.eq('No values');
          }
        });
      });
    });

    describe('D218B20Controller', () => {
      let validDevice: FileResult;
      let invalidDevice: FileResult;

      let controller: DS18B20Controller;

      const VALID_RAW_DATA =
        '72 01 4b 46 7f ff 0e 10 57 : crc=57 YES\n' +
        '72 01 4b 46 7f ff 0e 10 57 t=23125\n';

      const prefix = 'raspi-1wire-temp-unittest-';
      const postfix = '.dev';

      beforeEach(() => {
        validDevice = fileSync({
          mode: 0o644,
          prefix,
          postfix,
        });

        invalidDevice = fileSync({
          mode: 0o644,
          prefix,
          postfix,
        });

        writeSync(validDevice.fd, VALID_RAW_DATA);
        writeSync(invalidDevice.fd, 'ERROR');

        controller = new DS18B20Controller();
      });

      afterEach(() => {
        validDevice.removeCallback();
        invalidDevice.removeCallback();
      });

      describe('findDevices', () => {
        let globSpy: sinon.SinonSpy;

        beforeEach(() => {
          globSpy = sinon.spy(glob, 'sync');
        });

        it('should work without a hint', async () => {
          const devices = await controller.findDevices();
          expect(devices).to.be.instanceOf(Array);

          expect(globSpy.callCount).to.eq(1);

          const [pattern] = globSpy.firstCall.args;
          expect(pattern).to.eq('/sys/bus/w1/devices/28-*/w1_slave');
        });

        it('should work with a hint', async () => {
          const tempDir = dirname(validDevice.name);
          const pattern = `${tempDir}/${prefix}*${postfix}`;

          const devices = await controller.findDevices(pattern);

          expect(devices).to.have.lengthOf(2);

          expect(globSpy.callCount).to.eq(1);

          const [syncPattern] = globSpy.firstCall.args;
          expect(syncPattern).to.eq(pattern);
        });
      });

      describe('getCurrentValue', () => {
        it('should throw an error if the data is invalid', async () => {
          try {
            await controller.getCurrentValue(invalidDevice.name);
            expect.fail('should have thrown an error');
          } catch (err) {
            expect(err.message).to.eq('Raw data is not in the expected format');
          }
        });

        it('should return a valid temp if the file is available', async () => {
          const result = await controller.getCurrentValue(validDevice.name);
          expect(result.celcius).to.eq(23.125);
        });

        it('should error if the device does not exist', async () => {
          validDevice.removeCallback();

          const controller = new DS18B20Controller();

          try {
            await controller.getCurrentValue(validDevice.name);
            expect.fail('should have throw an error');
          } catch (err) {
            expect(err.message).to.eq('One wire device not found');
          }
        });

        it('should return a valid temp if the file is available', async () => {
          const result = await controller.getCurrentValue(validDevice.name);
          expect(result.celcius).to.eq(23.125);
        });

        it('should error if the device does not exist', async () => {
          validDevice.removeCallback();

          const controller = new DS18B20Controller();

          try {
            await controller.getCurrentValue(validDevice.name);
            expect.fail('should have throw an error');
          } catch (err) {
            expect(err.message).to.eq('One wire device not found');
          }
        });
      });
    });
  });
});