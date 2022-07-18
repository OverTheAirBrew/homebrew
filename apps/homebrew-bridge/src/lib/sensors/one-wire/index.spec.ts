import { Test } from '@nestjs/testing';
import { DS18B20Controller } from '@ota-internal/one-wire-sensor/dist';
import { SelectBoxProperty } from '@ota-internal/shared';
import { when } from 'jest-when';
import { OneWireSensor } from '.';

describe('sensors/one-wire', () => {
  let service: OneWireSensor;

  beforeEach(async () => {
    const currentValueStub = jest.fn();

    when(currentValueStub).calledWith('valid-sensor').mockResolvedValue({
      celcius: 10,
    });

    const moduleRef = await Test.createTestingModule({
      providers: [
        OneWireSensor,
        {
          provide: DS18B20Controller,
          useFactory: () => ({
            findDevices: jest.fn().mockResolvedValue(['valid-sensor']),
            getCurrentValue: currentValueStub,
          }),
        },
      ],
    }).compile();

    service = moduleRef.get(OneWireSensor);
  });

  describe('properties', () => {
    it('should return a list of sensors', async () => {
      const properties = service.properties;

      const sensorAddressProp = properties.find(
        (p) => p.id === 'sensorAddress',
      );
      expect(sensorAddressProp).toBeDefined();
      expect(
        await (sensorAddressProp as SelectBoxProperty<any>).values(),
      ).toContain('valid-sensor');
    });
  });

  describe('process', () => {
    it('should return null if the sensor does not exist', async () => {
      const result = await service.run('', {
        sensorAddress: '123434',
        offset: 0,
      });

      expect(result).toBeNull();
    });

    it('should return the value from the sensor', async () => {
      const result = await service.run('', {
        sensorAddress: 'valid-sensor',
        offset: 0,
      });

      expect(result).toBe(10);
    });

    it('should apply the offset if there is one', async () => {
      const result = await service.run('', {
        sensorAddress: 'valid-sensor',
        offset: 1,
      });

      expect(result).toBe(11);
    });
  });
});
