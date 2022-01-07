import {
  NumberProperty,
  SelectBoxProperty,
  StringProperty,
} from '@overtheairbrew/homebrew-plugin';
import { expect } from 'chai';
import { PropertyMapper } from '../../../src/app/lib/property-mapper';

describe('lib/property-mapper', () => {
  let propertyMapper: PropertyMapper;

  beforeEach(() => {
    propertyMapper = new PropertyMapper();
  });

  it('should map a string', async () => {
    const mappedString = await propertyMapper.map(
      new StringProperty('test', true),
    );

    expect(mappedString).to.deep.eq({
      isRequired: true,
      name: 'test',
      // placeholder: 'test',
      type: 'string',
    });
  });

  it('should map a number', async () => {
    const mappedString = await propertyMapper.map(
      new NumberProperty('test', true),
    );

    expect(mappedString).to.deep.eq({
      isRequired: true,
      name: 'test',
      type: 'number',
    });
  });

  it('should map a select-box', async () => {
    const mappedString = await propertyMapper.map(
      new SelectBoxProperty('test', true, () => ['testvalue']),
    );

    expect(mappedString).to.deep.eq({
      isRequired: true,
      name: 'test',
      type: 'select-box',
      selectBoxValues: ['testvalue'],
      // selectBoxDefaultValue: 'test',
    });
  });
});
