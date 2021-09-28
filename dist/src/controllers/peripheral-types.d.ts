import { PeripheralTypeDto } from '../lib/models/peripheral-type-dto';
import { PeripheralTypeService } from '../lib/peripheral-types';
export declare class PeripheralTypesController {
    private service;
    constructor(service: PeripheralTypeService);
    getPeripheralTypes(): Promise<PeripheralTypeDto[]>;
}
