import { expect } from 'chai';
import { TranslationsService } from '../../../../src/app/lib/translations';
import { GpioActor } from '../../../../src/app/plugins/actors/gpio';
import { PidLogic } from '../../../../src/app/plugins/logic/pid';
import { OneWireSensor } from '../../../../src/app/plugins/sensors/one-wire';

describe('lib/translations', () => {
  let translationsService: TranslationsService;

  beforeEach(() => {
    translationsService = new TranslationsService(
      [new OneWireSensor()],
      [new GpioActor()],
      [new PidLogic()],
    );
  });

  describe('generateTranslations', () => {
    it('should generate the full list of translations', async () => {
      const translationsResponse =
        await translationsService.generateTranslations();

      expect(translationsResponse).to.haveOwnProperty('translations');
      expect(translationsResponse).to.haveOwnProperty('namespaces');
      expect(translationsResponse).to.haveOwnProperty('locales');

      expect(translationsResponse.translations).to.not.be.undefined;
      expect(translationsResponse.namespaces).to.deep.eq([
        'one-wire-sensor',
        'pid-logic',
        'gpio-actor',
        'common',
      ]);

      expect(translationsResponse.locales).to.deep.eq(['en']);
    });
  });
});
