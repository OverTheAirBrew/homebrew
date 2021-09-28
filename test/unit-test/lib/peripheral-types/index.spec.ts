import { expect } from 'chai';
import { PropertyTypeMapper } from '../../../../src/lib/mappers/property-mapper';
import { PeripheralTypeService } from '../../../../src/lib/peripheral-types';
import { TestingActor } from '../../../test-data/actor-types';

describe('lib/peripheral-types', () => {
  let peripheralTypeService: PeripheralTypeService;

  beforeEach(() => {
    peripheralTypeService = new PeripheralTypeService(
      [new TestingActor()],
      new PropertyTypeMapper(),
    );
  });

  it('should return the mapped types', async () => {
    const response = await peripheralTypeService.getPeripheralTypes();

    expect(response).to.deep.eq([
      {
        id: 'testing-actor',
        properties: [
          {
            type: 'string',
            isRequired: true,
            name: 'testingprop',
            placeholder: 'data',
          },
        ],
      },
    ]);
  });
});
