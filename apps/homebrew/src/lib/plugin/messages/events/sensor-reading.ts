export module SensorReading {
  export const Topic = 'sensors.sensor.reading';
  export interface Data {
    sensor_id: string;
    value: number;
  }
  export const Data: Data = {} as any;
}
