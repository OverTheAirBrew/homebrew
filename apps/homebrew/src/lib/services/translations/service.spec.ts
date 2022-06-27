import { Test } from '@nestjs/testing';
import { IDevices, ILogics } from '../../../lib/constants';
import { TranslationsService } from './service';

describe('translations-service', () => {
  let service: TranslationsService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TranslationsService],
    })
      .useMocker((token) => {
        if (token === IDevices) {
          return [
            {
              name: 'testing-device',
              localizations: {
                en: {},
              },
              getRawSensorTypes: jest.fn().mockReturnValue([
                {
                  name: 'testing-sensor',
                  localizations: {
                    en: {},
                  },
                },
              ]),
              getRawActorTypes: jest.fn().mockReturnValue([
                {
                  name: 'testing-actor',
                  localizations: {
                    en: {},
                  },
                },
              ]),
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
      expect(namespaces).toEqual(['testing-logic', 'testing-device', 'common']);
    });
  });
});
