export declare module SensorReading {
    const EventName = "sensors.sensor.reading";
    interface Data {
        sensor_id: string;
        value: number;
    }
    const Data: Data;
}
