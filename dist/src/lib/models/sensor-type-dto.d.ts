export declare class SensorTypeDto {
    constructor(id: string, properties: PropertyDto[]);
    id: string;
    properties: PropertyDto[];
}
export declare class PropertyDto {
    constructor(type: any, required: boolean, name: string);
    type: string;
    name: string;
    placeholder: string;
    isRequired: boolean;
    selectBoxValues: any[];
}
