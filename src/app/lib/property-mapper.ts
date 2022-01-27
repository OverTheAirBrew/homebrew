import { Service } from 'typedi';
import { PropertyDto } from '../models/dto/property-dto';
import { Property, SelectBoxProperty } from './plugin/properties';

@Service()
export class PropertyMapper {
  public async map(
    parent_id: string,
    property: Property,
  ): Promise<PropertyDto> {
    const dto = new PropertyDto(
      property.id,
      property.type,
      property.required,
      `${parent_id}.${property.id}`,
    );

    if (property.type === 'string') {
      // const stringProp = property as StringProperty;
      // dto.placeholder = stringProp.placeholder;
    }

    if (property.type === 'select-box') {
      const selectBoxProp = property as SelectBoxProperty<any>;

      dto.selectBoxValues = await selectBoxProp.getValues();
      // dto.selectBoxDefaultValue = selectBoxProp.defaultValue;
    }

    return dto;
  }
}
