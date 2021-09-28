export declare enum SensorType {
    'onewire' = "one-wire"
}
export declare class OneWireConfig {
    busAddress: string;
}
export declare class Sensor {
    name: string;
    type_id: string;
    config: any;
}
export declare class SensorDto {
    constructor(id: string, name: string, type_id: string);
    id: string;
    name: string;
    type_id: string;
}
