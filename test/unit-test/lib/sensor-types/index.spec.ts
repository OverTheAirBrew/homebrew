import { expect } from 'chai';
import sinon, { StubbedInstance, stubConstructor } from 'ts-sinon';
import { Sensor } from '../../../../src/app/lib/plugin/abstractions/sensor';
import { StringProperty } from '../../../../src/app/lib/plugin/properties';
import { PropertyMapper } from '../../../../src/app/lib/property-mapper';
import { SensorTypesService } from '../../../../src/app/lib/sensor-types';

class TestSensor extends Sensor<any> {
  constructor() {
    super('testing-sensor', [new StringProperty('test', true)], {
      en: {},
      fr: {},
    });
  }

  public async process(params: any): Promise<number> {
    return 1;
  }
}

describe('lib/sensor-types', () => {
  let sensorTypesService: SensorTypesService;

  let propertyMapper: StubbedInstance<PropertyMapper>;

  before(() => {
    propertyMapper = stubConstructor(PropertyMapper);
    propertyMapper.map.resolves({} as any);

    sensorTypesService = new SensorTypesService(
      [new TestSensor()],
      propertyMapper,
    );
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getSensorTypes', () => {
    it('should map all the properties', async () => {
      const sensors = await sensorTypesService.getSensorTypes();

      expect(propertyMapper.map.callCount).to.eq(1);
      expect(sensors).to.have.lengthOf(1);

      expect(sensors).to.deep.eq([
        {
          properties: [{}],
          type: 'testing-sensor',
        },
      ]);
    });
  });

  describe('getRawSensorTypeById', () => {
    it('should return a raw sensor type if there is one', async () => {
      const sensorType = await sensorTypesService.getRawSensorTypeById(
        'testing-sensor',
      );
      expect(sensorType).to.be.instanceOf(Sensor);
    });

    it('should throw an error if the sensor type is invalid', async () => {
      try {
        await sensorTypesService.getRawSensorTypeById('unknown');
        expect.fail('should have thrown an error');
      } catch (err) {
        expect(err.message).to.eq('Invalid sensor type id');
      }
    });
  });

  describe('getSensorTypeById', () => {
    it('should return a mapped type', async () => {
      const sensorType = await sensorTypesService.getSensorTypeById(
        'testing-sensor',
      );

      expect(sensorType).to.deep.eq({
        properties: [{}],
        type: 'testing-sensor',
      });
    });
  });
});
