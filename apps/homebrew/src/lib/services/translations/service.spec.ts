import { Test } from '@nestjs/testing';
import { IActors, ILogics, ISensors } from '../../../lib/constants';
import { TranslationsService } from './service';

describe('translations-service', () => {
  let service: TranslationsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TranslationsService],
    })
      .useMocker((token) => {
        if (token === IActors) {
          return [
            {
              name: 'testing-actor',
              localizations: {
                en: {},
              },
            },
          ];
        }

        if (token === ISensors) {
          return [
            {
              name: 'testing-sensor',
              localizations: {
                en: {},
              },
            },
          ];
        }

        if (token === ILogics) {
          return [
            {
              name: 'testing-logic',
              localizations: {
                en: {},
              },
            },
          ];
        }
      })
      .compile();

    service = moduleRef.get(TranslationsService);
  });

  describe('generateTranslations', () => {
    it('should generate the translations', async () => {
      const { translations, namespaces, locales } =
        await service.generateTranslations();

      expect(locales).toStrictEqual(['en']);
      expect(namespaces).toEqual([
        'testing-sensor',
        'testing-actor',
        'testing-logic',
        'common',
      ]);
    });
  });
});
