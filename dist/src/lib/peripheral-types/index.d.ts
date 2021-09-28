import { Actor as ActorType } from '@overtheairbrew/homebrew-plugin';
import { PropertyTypeMapper } from '../mappers/property-mapper';
import { PeripheralTypeDto } from '../models/peripheral-type-dto';
export declare class PeripheralTypeService {
    private actors;
    propMapper: PropertyTypeMapper;
    constructor(actors: ActorType[], propMapper: PropertyTypeMapper);
    getPeripheralTypes(): Promise<PeripheralTypeDto[]>;
}
