import { Global, Injectable } from '@nestjs/common';
import { IProperty, SelectBoxProperty } from '@ota-internal/shared';
import { PropertyDto } from '../models/dto/property.dto';

@Global()
@Injectable()
export class PropertyMapper {
  public async map(
    parent_id: string,
    property: IProperty,
    device_name?: string,
  ): Promise<PropertyDto> {
    const propertyName = !!device_name
      ? `${device_name}:${parent_id}.${property.id}`
      : `${parent_id}:${property.id}`;

    const dto = new PropertyDto(
      property.id,
      property.type,
      property.required,
      propertyName,
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
