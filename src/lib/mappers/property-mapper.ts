import {
  Property,
  SelectBoxProperty,
  StringProperty,
} from '@overtheairbrew/homebrew-plugin';
import { Service } from 'typedi';
import { PropertyDto } from '../models/sensor-type-dto';

@Service()
export class PropertyTypeMapper {
  public async map(property: Property) {
    const prop = new PropertyDto(
      property.type,
      property.required,
      property.name,
    );

    if (property.type === 'select-box') {
      const castProp = property as SelectBoxProperty<any>;

      const values = await castProp.getValues();

      prop.selectBoxValues = values;
      prop.selectBoxDefaultValue = castProp.defaultValue;
    }

    if (property.type === 'string') {
      prop.placeholder = (property as StringProperty).placeholder;
    }

    return prop;
  }
}
