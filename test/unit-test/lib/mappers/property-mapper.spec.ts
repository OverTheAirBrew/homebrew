import {
  NumberProperty,
  SelectBoxProperty,
  StringProperty,
} from '@overtheairbrew/homebrew-plugin';
import { expect } from 'chai';
import { PropertyTypeMapper } from '../../../../src/lib/mappers/property-mapper';

describe('lib/mappers/property-mapper', () => {
  let propertyMapper: PropertyTypeMapper;

  beforeEach(() => {
    propertyMapper = new PropertyTypeMapper();
  });

  it('should map a number', async () => {
    const property = await propertyMapper.map(
      new NumberProperty('number property', true),
    );

    expect(property.name).to.eq('number property');
    expect(property.isRequired).to.be.true;
  });

  it('should map a string property', async () => {
    const property = await propertyMapper.map(
      new StringProperty('string property', 'string placeholder', true),
    );

    expect(property.name).to.eq('string property');
    expect(property.placeholder).to.eq('string placeholder');
    expect(property.isRequired).to.be.true;
  });

  it('should map a select box property list', async () => {
    const property = await propertyMapper.map(
      new SelectBoxProperty('selectbox property', 'test', true, () => {
        return ['test', 'test2'];
      }),
    );

    expect(property.name).to.eq('selectbox property');
    expect(property.selectBoxValues).to.deep.eq(['test', 'test2']);
    expect(property.isRequired).to.eq(true);
    expect(property.selectBoxDefaultValue).to.eq('test');
  });
});
