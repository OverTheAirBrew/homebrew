import { Property, SelectBoxProperty } from '@overtheairbrew/homebrew-plugin';
import { Service } from 'typedi';
import { PropertyDto } from '../models/dto/property-dto';

@Service()
export class PropertyMapper {
  public async map(property: Property): Promise<PropertyDto> {
    const dto = new PropertyDto(property.type, property.required, property.id);

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
