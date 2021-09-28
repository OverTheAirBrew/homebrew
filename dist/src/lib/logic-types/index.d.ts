import { Logic as LogicType } from '@overtheairbrew/homebrew-plugin';
import { PropertyTypeMapper } from '../mappers/property-mapper';
import { LogicTypeDto } from '../models/logic-type-dto';
export declare class LogicTypeService {
    private logics;
    propMapper: PropertyTypeMapper;
    constructor(logics: LogicType[], propMapper: PropertyTypeMapper);
    getLogicTypes(): Promise<LogicTypeDto[]>;
}
