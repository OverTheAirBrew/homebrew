import { expect } from 'chai';
import {
  NumberProperty,
  SelectBoxProperty,
  StringProperty,
} from '../../../src/app/lib/plugin/properties';
import { PropertyMapper } from '../../../src/app/lib/property-mapper';

describe('lib/property-mapper', () => {
  let propertyMapper: PropertyMapper;

  beforeEach(() => {
    propertyMapper = new PropertyMapper();
  });

  it('should map a string', async () => {
    const mappedString = await propertyMapper.map(
      'string',
      new StringProperty('test', true),
    );

    expect(mappedString).to.deep.eq({
      id: 'test',
      isRequired: true,
      name: 'string.test',
      type: 'string',
    });
  });

  it('should map a number', async () => {
    const mappedString = await propertyMapper.map(
      'number',
      new NumberProperty('test', true),
    );

    expect(mappedString).to.deep.eq({
      id: 'test',
      isRequired: true,
      name: 'number.test',
      type: 'number',
    });
  });

  it('should map a select-box', async () => {
    const mappedString = await propertyMapper.map(
      'selectbox',
      new SelectBoxProperty('test', true, () => ['testvalue']),
    );

    expect(mappedString).to.deep.eq({
      id: 'test',
      isRequired: true,
      name: 'selectbox.test',
      type: 'select-box',
      selectBoxValues: ['testvalue'],
      // selectBoxDefaultValue: 'test',
    });
  });
});
