import { Test } from '@nestjs/testing';
import {
  IOneWireController,
  StreamController,
} from '@ota-internal/one-wire-sensor/dist';
import { OneWireSensor } from '.';
import { SelectBoxProperty } from '../../../../plugin/properties';

describe('plugins/sensors/one-wire', () => {
  let service: OneWireSensor;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        OneWireSensor,
        {
          provide: IOneWireController,
          useFactory: () => {
            return new StreamController(true, [
              {
                address: '1234',
                expectedValues: [1, 2, 3, 4, 5],
              },
            ]);
          },
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
      ).toContain('1234');
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
        sensorAddress: '1234',
        offset: 0,
      });

      expect(result).toBe(1);
    });

    it('should apply the offset if there is one', async () => {
      const result = await service.run('', {
        sensorAddress: '1234',
        offset: 1,
      });

      expect(result).toBe(2);
    });
  });
});
