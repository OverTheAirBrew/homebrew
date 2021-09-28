import { Property } from '@overtheairbrew/homebrew-plugin';
import { PropertyDto } from '../models/sensor-type-dto';
export declare class PropertyTypeMapper {
    map(property: Property): Promise<PropertyDto>;
}
