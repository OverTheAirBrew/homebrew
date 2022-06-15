export module SensorReading {
  export const EventName = 'sensors.sensor.reading';
  export interface Data {
    sensor_id: string;
    value: number;
  }
  export const Data: Data = {} as any;
}
