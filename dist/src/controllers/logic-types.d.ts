import { LogicTypeService } from '../lib/logic-types';
import { LogicTypeDto } from '../lib/models/logic-type-dto';
export declare class LogicTypesController {
    private service;
    constructor(service: LogicTypeService);
    getSensorTypes(): Promise<LogicTypeDto[]>;
}
