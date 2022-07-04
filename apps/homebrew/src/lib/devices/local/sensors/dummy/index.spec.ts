import { Test } from '@nestjs/testing';
import { DummySensor } from '.';

describe('sensors/dummy', () => {
  let service: DummySensor;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [DummySensor],
    }).compile();

    service = moduleRef.get(DummySensor);
  });

  describe('properties', () => {
    it('should return a list of properties', async () => {
      const properties = service.properties;

      const sensorAddressProp = properties.find((p) => p.id === 'values');
      expect(sensorAddressProp).toBeDefined();
    });
  });

  describe('process', () => {
    it('should return the value from the sensor', async () => {
      const result = await service.run('', {
        values: '1,2,3,4,5',
      });

      expect(result).toBeGreaterThanOrEqual(1);
      expect(result).toBeLessThanOrEqual(5);
    });
  });

  describe('validate', () => {
    it('should return true if the values are valid', async () => {
      const result = await service.validate({
        values: '1,2,3,4,5',
      });

      expect(result).toBeTruthy();
    });

    it('should return false if the values are invalid', async () => {
      const result = await service.validate({
        values: '1,A,B,C',
      });

      expect(result).toBeFalsy();
    });
  });
});
