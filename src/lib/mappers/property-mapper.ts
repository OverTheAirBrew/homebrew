import {
  Property,
  SelectBoxProperty,
  StringProperty,
} from '@overtheairbrew/homebrew-plugin';
import { Container, Service } from 'typedi';
import { LocaleService } from '../locale-service';
import { PropertyDto } from '../models/sensor-type-dto';

@Service()
export class PropertyTypeMapper {
  public async map(property: Property) {
    const localeService = Container.get(LocaleService);

    const localizedPropertyName = await localeService.getTranslatedVersion(
      property.name,
    );

    const prop = new PropertyDto(
      property.type,
      property.required,
      localizedPropertyName,
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
