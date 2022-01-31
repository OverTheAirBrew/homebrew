import { Service } from 'typedi';
import { PropertyDto } from '../models/dto/property-dto';
import { Property, SelectBoxProperty } from './plugin/properties';

@Service()
export class PropertyMapper {
  private async generatePropertyName(parent_id: string, name: string) {
    return `${parent_id}.${name.toLowerCase().replace(/\s/g, '-')}`;
  }

  public async map(
    parent_id: string,
    property: Property,
  ): Promise<PropertyDto> {
    const dto = new PropertyDto(
      property.id,
      property.type,
      property.required,
      await this.generatePropertyName(parent_id, property.id),
    );

    if (property.type === 'string') {
      // const stringProp = property as StringProperty;
      // dto.placeholder = stringProp.placeholder;
    }

    if (property.type === 'select-box') {
      const selectBoxProp = property as SelectBoxProperty<any>;

      const values = await selectBoxProp.getValues();
      const mappedValues = await Promise.all(
        values.map(async (val) => {
          if (typeof val === 'object') {
            return {
              key: val.key,
              value: await this.generatePropertyName(parent_id, val.value),
            };
          }

          return {
            key: val,
            value: val,
          };
        }),
      );

      dto.selectBoxValues = mappedValues;
    }

    return dto;
  }
}
