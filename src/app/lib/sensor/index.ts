import { Service } from 'typedi';
import { Sensor as ControllerSensor } from '../../models/controller/sensor';
import { Sensor } from '../../orm/models/sensor';
import { IMessagingManager } from '../plugin/abstractions/messaging-manager';
import { SensorReading } from '../plugin/messages/events/sensor-reading';
import { SensorTypesService } from '../sensor-types';
import { SensorRepository } from './repository';
import { SensorValidator } from './validator';

@Service()
export class SensorService {
  constructor(
    private validator: SensorValidator,
    private sensorRepository: SensorRepository,
    private sensorTypesService: SensorTypesService,
    private messagingManager: IMessagingManager,
  ) {}

  async getAllSensors() {
    const sensors = await this.sensorRepository.getAllSensors();
    return Promise.all(sensors.map((sensor) => this.mapSensor(sensor)));
  }

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

    console.log(sensors);

    const promises = sensors.map((sensor) =>
      this.sendTempEventForSensor(sensor),
    );
    await Promise.all(promises);
  }

  async getSensorById(id: string) {
    const sensor = await this.sensorRepository.getSensorById(id);

    if (!sensor) {
      throw new Error('sensor not found');
    }

    return await this.mapSensor(sensor);
  }

  private async mapSensor(sensor: Sensor) {
    return {
      id: sensor.id,
      name: sensor.name,
      type_id: sensor.type_id,
      config: JSON.parse(sensor.config),
    };
  }

  private async sendTempEventForSensor(sensor: Sensor) {
    const sensorType = await this.sensorTypesService.getRawSensorTypeById(
      sensor.type_id,
    );
    const config = JSON.parse(sensor.config);

    const value = await sensorType.run(sensor.id, config);

    console.log(sensor, value);

    if (value) {
      await this.messagingManager.sendEvent(SensorReading)({
        sensor_id: sensor.id,
        value,
      });
    }
  }
}
