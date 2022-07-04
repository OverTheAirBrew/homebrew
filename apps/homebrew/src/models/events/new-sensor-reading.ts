export class NewSensorReading {
  static Channel = Symbol('NewSensorReadingEvent');

  constructor(public sensor_id: string, public reading: number) {}
}
