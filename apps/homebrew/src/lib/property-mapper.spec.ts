import { Test } from '@nestjs/testing';
import {
  NumberProperty,
  SelectBoxProperty,
  StringProperty,
} from './plugin/properties';
import { PropertyMapper } from './property-mapper';

describe('lib/property-mapper', () => {
  let service: PropertyMapper;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PropertyMapper],
    }).compile();

    service = moduleRef.get(PropertyMapper);
  });

  describe('map', () => {
    it('should map a number property', async () => {
      const response = await service.map(
        'numeric',
        new NumberProperty('test', true),
      );

      expect(response).toMatchObject({
        id: 'test',
        type: 'number',
        isRequired: true,
      });
    });

    it('should map a string property', async () => {
      const response = await service.map(
        'test',
        new StringProperty('test', true),
      );

      expect(response).toMatchObject({
        id: 'test',
        type: 'string',
        isRequired: true,
      });
    });

    it('should map a selectbox property', async () => {
      const response = await service.map(
        'test',
        new SelectBoxProperty('test', true, () => [1, 2, 3, 4]),
      );

      expect(response).toMatchObject({
        id: 'test',
        type: 'select-box',
        isRequired: true,
        selectBoxValues: [1, 2, 3, 4],
      });
    });
  });
});
