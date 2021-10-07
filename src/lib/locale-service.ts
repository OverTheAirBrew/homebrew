import * as i18n from 'i18n';
import { join } from 'path';
import { Service } from 'typedi';

@Service()
export class LocaleService {
  private locales: string[] = ['en'];

  constructor() {
    const directory = join(__dirname, '..', 'locales');

    i18n.configure({
      locales: ['en', 'fr'],
      defaultLocale: 'en',
      directory,
      missingKeyFn: (locale, value) => {
        console.log(locale, value);
        return '';
      },
    });
  }

  public async setLocale(locales: string[]) {
    this.locales = locales;
  }

  public async getTranslatedVersion(id: string) {
    for (const locale of this.locales) {
      const value = i18n.__({ phrase: id, locale: locale });

      if (value) return value;
    }

    return i18n.__({ phrase: id, locale: 'en' });
  }
}
