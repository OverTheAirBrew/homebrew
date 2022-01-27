import { Service } from 'typedi';
import { Sensor as ControllerSensor } from '../../models/controller/sensor';
import { Sensor } from '../../orm/models/sensor';
import { ILogger } from '../plugin/abstractions/logger';
import { SensorTypesService } from '../sensor-types';
import { SensorRepository } from './repository';
import { SensorValidator } from './validator';

@Service()
export class SensorService {
  constructor(
    private validator: SensorValidator,
    private sensorRepository: SensorRepository,
    private sensorTypesService: SensorTypesService,
    private logger: ILogger,
  ) {}

  async createNewSensor(sensor: ControllerSensor) {
    const errors = await this.validator.validateAsync(sensor);

    if (await this.validator.isValid(errors)) {
      const id = await this.sensorRepository.createSensor(
        sensor.name,
        sensor.type_id,
        sensor.config,
      );

      return { id };
    }

    throw new Error('Invalid sensor');
  }

  async processLatestSensorReadings() {
    const sensors = await this.sensorRepository.getAllSensors();

    const promises = sensors.map((sensor) =>
      this.sendTempEventForSensor(sensor),
    );
    await Promise.all(promises);
  }

  private async sendTempEventForSensor(sensor: Sensor) {
    try {
      const sensorType = await this.sensorTypesService.getRawSensorTypeById(
        sensor.type_id,
      );
      const config = JSON.parse(sensor.config);

      await sensorType.run(sensor.id, config);
    } catch (err) {
      this.logger.error(err);
    }
  }
}
